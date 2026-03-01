import * as cheerio from "cheerio";
import { Configuration, MemoryStorage, PlaywrightCrawler } from "crawlee";
import { env } from "~/env";
import { getOrSetCache } from "../../../../../lib/redis";
import type { ImdbDetailsResultType, SearchResultType } from "../types";
import type { ImdbEnrichmentData } from "../types/imdb-enrichment-data.type";
import type {
  ImdbJsonLdActor,
  ImdbJsonLdMovieOrTv,
} from "../types/imdb-json-ld.type";
import { findByImdbId } from "./tmdb.service";

const IMDB_TITLE_BASE = "https://www.imdb.com/title";
const IMDB_ADVANCED_SEARCH_BASE = "https://www.imdb.com/search/title";
const CRAWLER_TIMEOUT_SEC = 30;
const CACHE_TTL_SEC = 60 * 60 * 24; // 24 hours
const IMDB_SEARCH_CACHE_TTL_SEC = 60 * 5; // 5 minutes for search

type ImdbSearchCandidate = {
  parsedId: string;
  title: string | null;
  image: string | null;
  year: number | null;
  description: string | null;
  keywords: string[];
  rating: number | null;
};

function normalizeImdbId(imdbId: string): string {
  return imdbId.startsWith("tt") ? imdbId : `tt${imdbId}`;
}

/**
 * Fetch IMDB title page HTML using Crawlee (Playwright). Returns null on failure.
 */
async function fetchImdbPageHtml(imdbId: string): Promise<string | null> {
  const url = `${IMDB_TITLE_BASE}/${imdbId}/`;
  let html: string | null = null;

  try {
    const crawler = new PlaywrightCrawler(
      {
        maxRequestsPerCrawl: 1,
        requestHandlerTimeoutSecs: CRAWLER_TIMEOUT_SEC,
        async requestHandler({ page }) {
          html = await page.content();
        },
      },
      new Configuration({ storageClient: new MemoryStorage({ persistStorage: false }) }),
    );

    await crawler.run([url]);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "MODULE_NOT_FOUND" && err?.message?.includes("playwright")) {
      console.warn("[IMDB enrich] Playwright not available, skipping page fetch", { imdbId, url });
    } else {
      console.error("[IMDB enrich] Crawlee fetch failed", error, { imdbId, url });
    }
    return null;
  }

  return html;
}

/**
 * Fetch IMDB advanced search page HTML. Returns null on failure.
 */
async function fetchImdbAdvancedSearchHtml(query: string): Promise<string | null> {
  const url = `${IMDB_ADVANCED_SEARCH_BASE}/?title=${encodeURIComponent(query.trim())}`;
  let html: string | null = null;

  try {
    const crawler = new PlaywrightCrawler(
      {
        maxRequestsPerCrawl: 1,
        requestHandlerTimeoutSecs: CRAWLER_TIMEOUT_SEC,
        async requestHandler({ page }) {
          html = await page.content();
        },
      },
      new Configuration({ storageClient: new MemoryStorage({ persistStorage: false }) }),
    );

    await crawler.run([url]);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "MODULE_NOT_FOUND" && err?.message?.includes("playwright")) {
      console.warn("[IMDB search] Playwright not available, skipping advanced-search fetch", {
        query,
        url,
      });
    } else {
      console.error("[IMDB search] Crawlee advanced-search fetch failed", error, { query, url });
    }
    return null;
  }

  return html;
}

/** Build optimised IMDB image URLs from a raw poster URL. */
function getHighQualityImageUrls(originalUrl: string | null): {
  raw: string;
  optimized: string;
  small: string;
} | null {
  if (!originalUrl) return null;
  const baseUrlMatch = /(.*?)\._V1/.exec(originalUrl);
  if (!baseUrlMatch)
    return { raw: originalUrl, optimized: originalUrl, small: originalUrl };
  const base = baseUrlMatch[1];
  return {
    raw: `${base}._V1_.jpg`,
    optimized: `${base}._V1_QL80_UY1080_.jpg`,
    small: `${base}._V1_QL75_UY600_.jpg`,
  };
}

/** Parse IMDB advanced search page results. */
function parseAdvancedSearch(html: string, limit: number): ImdbSearchCandidate[] {
  const $ = cheerio.load(html);
  const results: ImdbSearchCandidate[] = [];
  const elements = $(".ipc-metadata-list-summary-item").slice(0, limit);

  elements.each((_, element) => {
    const candidate: ImdbSearchCandidate = {
      parsedId: "",
      title: null,
      image: null,
      year: null,
      description: null,
      keywords: [],
      rating: null,
    };

    const rawTitle = $(element).find(".dli-title h3.ipc-title__text").text();
    candidate.title = rawTitle.split(". ").slice(1).join(". ") || rawTitle || null;

    $(element).find(".dli-title-metadata-item").each((index, item) => {
      const text = $(item).text();
      if (index === 0) {
        const y = parseInt(text, 10);
        candidate.year = Number.isNaN(y) ? null : y;
      } else {
        candidate.keywords.push(text);
      }
    });

    const ratingEl = $(element).find(".ratingGroup--imdb-rating");
    if (ratingEl.length) {
      const ratingText = ratingEl.find(".ipc-rating-star--rating").text().trim();
      const ratingNum = parseFloat(ratingText);
      if (!Number.isNaN(ratingNum)) candidate.rating = ratingNum;
      if (ratingText) candidate.keywords.push(`${ratingText} imdb`);
    }

    candidate.description = $(element).find(".dli-plot-container").text().trim() || null;

    const posterSrc = $(element).find(".ipc-image").attr("src");
    if (posterSrc) {
      candidate.image = getHighQualityImageUrls(posterSrc)?.small ?? null;
    }

    const href = $(element).find(".ipc-title-link-wrapper").attr("href");
    const match = /\/title\/(tt\d+)/.exec(`https://www.imdb.com${href ?? ""}`);
    candidate.parsedId = match?.[1] ?? "";

    if (candidate.parsedId) results.push(candidate);
  });

  return results;
}

/**
 * Search video (movie/tv) on IMDB using both quick-find and advanced-search pages.
 * Results are merged, deduplicated by parsedId, then resolved via TMDB for mediaType.
 * IMDB poster takes priority over TMDB poster.
 * Returns up to `limit` results; empty array on fetch/parse failure.
 */
export async function searchVideoByImdb(
  query: string,
  limit: number,
): Promise<SearchResultType[]> {
  const normalizedQuery = query.trim().toLowerCase();

  const results = await getOrSetCache(
    (async (): Promise<SearchResultType[]> => {
      try {
        console.log("[IMDB search] Start", { query: normalizedQuery, limit });

        const advancedHtml = await fetchImdbAdvancedSearchHtml(query);
        const candidates = advancedHtml ? parseAdvancedSearch(advancedHtml, 20) : [];

        console.log("[IMDB search] Advanced search parsed", {
          query: normalizedQuery,
          count: candidates.length,
          ids: candidates.map((c) => c.parsedId),
        });

        // Resolve all TMDB lookups in parallel to avoid sequential latency
        const tmdbResults = await Promise.allSettled(
          candidates.map((c) => findByImdbId(c.parsedId)),
        );

        const notFoundInTmdb = candidates
          .filter((_, i) => {
            const r = tmdbResults[i];
            return r?.status !== "fulfilled" || !r.value;
          })
          .map((c) => c.parsedId);

        if (notFoundInTmdb.length > 0) {
          console.log("[IMDB search] IDs not found in TMDB (skipped)", {
            query: normalizedQuery,
            count: notFoundInTmdb.length,
            ids: notFoundInTmdb,
          });
        }

        const out: SearchResultType[] = [];

        for (let i = 0; i < candidates.length; i++) {
          if (out.length >= limit) break;

          const tmdb = tmdbResults[i];
          if (tmdb?.status !== "fulfilled" || !tmdb.value) continue;

          const candidate = candidates[i]!;
          // IMDB poster has higher priority; fall back to TMDB poster
          const image = candidate.image ?? tmdb.value.posterUrl;
          // IMDB plot has higher priority; fall back to TMDB overview
          const description = candidate.description ?? tmdb.value.description;

          out.push({
            id: null,
            title: candidate.title,
            image,
            year: candidate.year,
            description,
            keywords: candidate.keywords,
            parsedId: candidate.parsedId,
            mediaType: tmdb.value.mediaType,
            rating: candidate.rating,
          });
        }

        console.log("[IMDB search] Done — resolved via TMDB", {
          query: normalizedQuery,
          count: out.length,
          ids: out.map((r) => r.parsedId),
        });
        return out;
      } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err?.code === "MODULE_NOT_FOUND" && err?.message?.includes("playwright")) {
          console.warn("[IMDB search] Playwright not available, skipping IMDB search", {
            query: normalizedQuery,
          });
          return [];
        }
        console.error("[IMDB search] Failed", error, { query: normalizedQuery });
        return [];
      }
    })(),
    "parse",
    "imdbSearch",
    { query: normalizedQuery, limit },
    IMDB_SEARCH_CACHE_TTL_SEC,
  );

  return results;
}

/**
 * Extract enrichment data from IMDB title page HTML (JSON-LD + cheerio).
 */
function parseImdbPageToEnrichmentData(html: string): ImdbEnrichmentData {
  const data: ImdbEnrichmentData = {};
  const $ = cheerio.load(html);

  // 1) JSON-LD: Movie / TVSeries block
  $('script[type="application/ld+json"]').each((_, el) => {
    const text = $(el).html();
    if (!text) return;
    try {
      const parsed = JSON.parse(text) as
        | ImdbJsonLdMovieOrTv
        | { "@graph"?: ImdbJsonLdMovieOrTv[] };
      const items = Array.isArray(parsed)
        ? parsed
        : "@graph" in parsed && Array.isArray(parsed["@graph"])
          ? parsed["@graph"]
          : [parsed as ImdbJsonLdMovieOrTv];

      for (const item of items) {
        const type = item["@type"];
        if (type !== "Movie" && type !== "TVSeries") continue;

        if (item.description && !data.description)
          data.description = item.description.trim();
        if (item.contentRating && !data.contentRating)
          data.contentRating = item.contentRating.trim();

        const rating = item.aggregateRating?.ratingValue;
        if (rating != null) {
          const num = Number.parseFloat(String(rating));
          if (!Number.isNaN(num)) data.rating = num;
        }

        if (item.actor && Array.isArray(item.actor) && !data.people) {
          data.people = item.actor
            .map((a: ImdbJsonLdActor) =>
              typeof a === "object" && a?.name ? a.name.trim() : null,
            )
            .filter((n: string | null): n is string => Boolean(n));
        }
      }
    } catch {
      // ignore invalid JSON-LD
    }
  });

  // 2) HTML: keywords (Plot Keywords section)
  const keywordLinks = $('a[href*="/keyword/"]')
    .map((_, el) => $(el).text().trim())
    .get();
  if (keywordLinks.length > 0) {
    const unique = [...new Set(keywordLinks)].filter(Boolean);
    if (unique.length > 0) data.keywords = unique;
  }

  // 3) HTML: production companies (link to company pages)
  const productionLinks = $('a[href*="/company/"]')
    .map((_, el) => $(el).text().trim())
    .get();
  if (productionLinks.length > 0) {
    const unique = [...new Set(productionLinks)].filter(Boolean);
    if (unique.length > 0) data.production = unique;
  }

  return data;
}

/**
 * Merge enrichment data into base details. Does not mutate base; returns new object.
 */
function mergeEnrichmentIntoBase(
  base: ImdbDetailsResultType,
  enrichment: ImdbEnrichmentData,
): ImdbDetailsResultType {
  const seenPeople = new Set<string>();
  const people: string[] = [];
  for (const p of [...base.people, ...(enrichment.people ?? [])]) {
    const key = p.trim().toLowerCase();
    if (key && !seenPeople.has(key)) {
      seenPeople.add(key);
      people.push(p.trim());
    }
  }

  const seenKeywords = new Set<string>();
  const keywords: string[] = [];
  for (const k of [...base.keywords, ...(enrichment.keywords ?? [])]) {
    const key = k.trim().toLowerCase();
    if (key && !seenKeywords.has(key)) {
      seenKeywords.add(key);
      keywords.push(k.trim());
    }
  }

  const production =
    base.production.length > 0
      ? [...new Set([...base.production, ...(enrichment.production ?? [])])]
      : enrichment.production ?? [];

  return {
    ...base,
    description:
      enrichment.description?.trim() ?? base.description,
    rating: enrichment.rating ?? base.rating,
    contentRating:
      enrichment.contentRating?.trim() ?? base.contentRating,
    people,
    keywords,
    production,
  };
}

/**
 * Enrich base TMDB details with data from IMDB title page. Uses Redis cache by imdbId.
 * On fetch/parse error or when IMDB_ENRICH_ENABLED is false, returns base unchanged.
 */
export async function enrichVideoDetailsFromImdb(
  imdbId: string,
  base: ImdbDetailsResultType,
): Promise<ImdbDetailsResultType> {
  const normalizedId = normalizeImdbId(imdbId);
  if (!env.IMDB_ENRICH_ENABLED) {
    console.log("[IMDB enrich] Skipped (IMDB_ENRICH_ENABLED is false)", {
      imdbId: normalizedId,
    });
    return base;
  }

  console.log("[IMDB enrich] Start", { imdbId: normalizedId, title: base.title });

  const merged = await getOrSetCache(
    (async (): Promise<ImdbDetailsResultType> => {
      try {
        const url = `${IMDB_TITLE_BASE}/${normalizedId}/`;
        console.log("[IMDB enrich] Fetching page", { imdbId: normalizedId, url });

        const html = await fetchImdbPageHtml(normalizedId);
        if (!html) return base;

        console.log("[IMDB enrich] Fetched HTML", {
          imdbId: normalizedId,
          htmlLength: html.length,
        });

        const enrichment = parseImdbPageToEnrichmentData(html);
        console.log("[IMDB enrich] Parsed enrichment", {
          imdbId: normalizedId,
          peopleCount: enrichment.people?.length ?? 0,
          keywordsCount: enrichment.keywords?.length ?? 0,
          productionCount: enrichment.production?.length ?? 0,
          hasDescription: Boolean(enrichment.description),
          hasRating: enrichment.rating != null,
          hasContentRating: Boolean(enrichment.contentRating),
        });

        const result = mergeEnrichmentIntoBase(base, enrichment);
        console.log("[IMDB enrich] Merged details", { imdbId: normalizedId });
        return result;
      } catch (error) {
        console.error("[IMDB enrich] Enrich or merge failed", error, {
          imdbId: normalizedId,
        });
        return base;
      }
    })(),
    "parse",
    "imdbCrawleeEnrich",
    { parsedId: normalizedId },
    CACHE_TTL_SEC,
  );

  return merged;
}
