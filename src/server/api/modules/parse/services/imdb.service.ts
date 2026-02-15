import type {
  ImdbDetailsResultType,
  SearchResultType,
  ImdbSearchInputType,
  SearchType,
  SearchQuery,
} from "../types";
import * as cheerio from "cheerio";
import { fetchWithScrapingAnt, getOrSetCache } from "../../../../../lib";

// #region Private Functions
async function GetHtmlFromUrl(url: string): Promise<string> {
  console.log(`[GetHtmlFromUrl] Fetching URL: ${url}`);
  const startTime = Date.now();
  
  try {
    const html = await fetchWithScrapingAnt(url, {
      timeout: 60, // Increased timeout from 30 to 60 seconds
      browser: true,
      proxyType: "datacenter",
    });
    const duration = Date.now() - startTime;
    console.log(`[GetHtmlFromUrl] Successfully fetched URL: ${url} (${duration}ms)`);
    return html;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[GetHtmlFromUrl] Failed to fetch URL after ${duration}ms: ${url}`);
    throw new Error(
      `IMDB parse error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function ExtractElements<T>(...arrays: Record<string, any>[][]): T[] {
  const getItem = (item: Record<string, any>): T => {
    return (
      item.credits?.map((credit: any) => credit?.name?.nameText?.text)?.[0] ||
      item.node?.company?.companyText?.text ||
      item.node?.primaryText?.text ||
      item.name?.nameText?.text ||
      item.node?.text ||
      item.genre?.text ||
      item.name ||
      item.id
    );
  };

  const extractedArrays = arrays.map((array) => {
    if (!array) return [];
    return array.filter(getItem).map(getItem);
  });

  return [...new Set(extractedArrays.flat())];
}

function FillImdbDetailsResult(props: any): ImdbDetailsResultType {
  return {
    title: props.titleText?.text ?? props.originalTitleText?.text ?? null,
    image: GetHighQualityImageUrls(props.primaryImage?.url)?.optimized ?? null,
    description: props.summaries[1] || props.plot?.plotText?.plainText || null,
    type: {
      titleType: props.titleType?.id ?? null,
      isSeries: !!props.titleType?.isSeries,
      isEpisode: !!props.titleType?.isEpisode,
      canHaveEpisodes: !!props.titleType?.canHaveEpisodes,
    },
    // year: {
    //   release: props.releaseYear?.year ?? null,
    //   end: props.releaseYear?.endYear ?? null,
    // },
    year: props.releaseYear?.year ?? null,
    // runtime: {
    //   seconds: props.runtime?.seconds ?? null,
    //   text: props.runtime?.displayableProperty?.value?.plainText ?? null,
    // },
    runtime: props.runtime?.displayableProperty?.value?.plainText ?? null,
    rating: props.ratingsSummary?.aggregateRating ?? null,
    isAdult: props.isAdult ?? null,
    contentRating: props.contentRating ?? null,
    production: ExtractElements<string>(props.production?.edges),
    people: ExtractElements<string>(
      props.castPageTitle?.edges,
      props.actor,
      props.director,
      props.creator,
      props.creatorsPageTitle,
      props.directorsPageTitle,
    ),
    genres: ExtractElements<string>(
      props.genres?.genres,
      props.titleGenres?.genres,
    ),
    keywords: ExtractElements<string>(
      props.keywords?.edges,
      props.interests?.edges,
    ),
  };
}

function GetHighQualityImageUrls(originalUrl: string | null) {
  if (!originalUrl) return null;

  const baseUrlMatch = /(.*?)\._V1/.exec(originalUrl);
  if (!baseUrlMatch)
    return {
      raw: originalUrl,
      optimized: originalUrl,
      small: originalUrl,
    };

  const baseUrl = baseUrlMatch[1];

  return {
    raw: `${baseUrl}._V1_.jpg`,
    optimized: `${baseUrl}._V1_QL80_UY1080_.jpg`,
    small: `${baseUrl}._V1_QL75_UY600_.jpg`,
  };
}

function parseQueryString(input: string): SearchQuery {
  const result: SearchQuery = {
    title: "",
    meta: null,
    year: null,
  };

  const titleRegex = /^(.*?)( \[| \(|$)/;
  const titleMatch = titleRegex.exec(input)?.at(1);
  result.title = titleMatch || "";

  if (!result.title) throw new Error("Title is required");

  const yearRegex = /\((\d{4})\)$/;
  const yearMatch = yearRegex.exec(input)?.at(1);
  result.year = yearMatch ? parseInt(yearMatch, 10) : null;

  const metaRegex = /\[([^\]]*)\]/;
  const metaMatch = metaRegex.exec(input)?.at(1);
  result.meta = metaMatch || null;

  return result;
}

function mergeMeta(meta1: string | null, meta2: string | null): string {
  const params = new URLSearchParams();

  [meta1, meta2].forEach((meta) => {
    if (meta) {
      const metaParams = new URLSearchParams(meta);
      metaParams.forEach((value, key) => {
        params.set(key, value);
      });
    }
  });

  return params.toString() ? `?${params.toString()}` : "";
}

function removeSignatures(text: string): string {
  const signaturePattern = /\s?—[\w\s]+$/gm;
  return text.replace(signaturePattern, "");
}

function ParseQuickSearch(props: {
  html: string;
  limit: number;
}): SearchResultType[] {
  const { html, limit } = props;
  const $ = cheerio.load(html);
  const results: SearchResultType[] = [];
  const elements = $("li.find-title-result").slice(0, limit);
  elements.each((_, element) => {
    const titleElement = $(element).find(".ipc-metadata-list-summary-item__t");
    const title = titleElement.text().trim() ?? null;
    const link = titleElement.attr("href") ?? null;

    const imageElement = $(element).find("img.ipc-image");
    const image = imageElement.attr("src") ?? null;

    const yearElement = $(element).find(".ipc-inline-list__item").first();
    const year = parseInt(yearElement.text().trim()) ?? null;

    const actorElements = $(element).find(
      ".ipc-metadata-list-summary-item__stl .ipc-inline-list__item",
    );
    const actors: string[] = [];
    actorElements.each((_, actorEl) => {
      const actor = $(actorEl).text().trim();
      if (actor) actors.push(actor);
    });

    const parsedId = link?.match(/\/title\/(tt\d+)/)?.[1];
    if (parsedId) {
      results.push({
        id: null,
        title,
        image: GetHighQualityImageUrls(image)?.small ?? null,
        year,
        description: null,
        keywords: actors,
        parsedId,
      });
    }
  });

  return results;
}

function ParseAdvancedSearch(props: {
  html: string;
  limit: number;
}): SearchResultType[] {
  const { html, limit } = props;
  const $ = cheerio.load(html);

  const results: SearchResultType[] = [];
  const elements = $(".ipc-metadata-list-summary-item").slice(0, limit);
  elements.each((_, element) => {
    const result: SearchResultType = {
      id: null,
      description: null,
      image: null,
      keywords: [],
      title: null,
      year: null,
      parsedId: "",
    };

    const titleElement = $(element).find(".dli-title h3.ipc-title__text");
    const rawTitle = titleElement.text();
    result.title = rawTitle.split(". ").slice(1).join(". ") ?? rawTitle ?? null;

    const metadata = $(element).find(".dli-title-metadata-item");
    metadata.each((index, item) => {
      const text = $(item).text();
      if (index === 0) result.year = parseInt(text) ?? null;
      if (index === 1) result.keywords.push(text);
      if (index === 2) result.keywords.push(text);
    });

    const ratingElement = $(element).find(".ratingGroup--imdb-rating");
    if (ratingElement.length) {
      const rating =
        ratingElement.find(".ipc-rating-star--rating").text() + " imdb";
      result.keywords.push(rating);
    }

    // const metacriticElement = $(element).find(".metacritic-score-box");
    // if (metacriticElement.length) {
    //   const metacritic = parseInt(metacriticElement.text()) + " metascore";
    //   result.keywords.push(metacritic);
    // }

    const plotElement = $(element).find(".dli-plot-container");
    result.description = plotElement.text().trim();

    // Get poster URL
    const posterImg = $(element).find(".ipc-image").attr("src");
    if (posterImg) {
      result.image = GetHighQualityImageUrls(posterImg)?.small ?? null;
    }

    // Get movie/show URL
    const linkElement = $(element).find(".ipc-title-link-wrapper");
    const link = "https://www.imdb.com" + linkElement.attr("href");
    const match = /\/title\/(tt\d+)/.exec(link);
    result.parsedId = match?.[1] ?? "";

    if (result.parsedId) {
      results.push(result);
    }
  });

  return results;
}

async function GetQuickSearchHtml(
  props: {
    type: SearchType;
  } & Omit<SearchQuery, "meta">,
): Promise<string> {
  const { type, title, year } = props;

  let query = `q=${encodeURIComponent(title)}`;

  if (year) {
    query += ` ${year}`;
  }

  let defaultMeta = `?${query}?&s=tt`;

  switch (type) {
    case "film":
      defaultMeta += "&ttype=ft";
      break;
    case "series":
      defaultMeta += "&ttype=tv";
      break;
    case "all":
      break;
  }

  const url = `https://www.imdb.com/find/${defaultMeta}`;
  return GetHtmlFromUrl(url);
}

async function GetAdvancedSearchHtml(
  props: {
    type: SearchType;
  } & SearchQuery,
): Promise<string> {
  const { type, title, meta, year } = props;

  let defaultMeta = `?title=${encodeURIComponent(title)}`;
  switch (type) {
    case "film":
      defaultMeta += `&title_type=${encodeURIComponent("feature,tv_movie,short,tv_short,video")}`;
      break;
    case "series":
      defaultMeta += `&title_type=${encodeURIComponent("tv_series,tv_miniseries")}`;
      break;
  }

  if (year) {
    const release_date = `&release_date=${year}-01-01,${year}-12-31`;
    defaultMeta += release_date;
  }

  const mergedMeta = mergeMeta(meta, defaultMeta);

  const url = `https://www.imdb.com/search/title/${mergedMeta}`;
  return GetHtmlFromUrl(url);
}

// #endregion Private Functions

// #region Public Functions
async function GetImdbDetailsByIdUncached(
  id: string,
): Promise<ImdbDetailsResultType> {
  console.log(`[IMDB] Starting to fetch details for ID: ${id}`);
  const startTime = Date.now();
  
  try {
    // Note: ScrapingAnt allows only 1 concurrent request, so we must fetch sequentially
    console.log(`[IMDB] Fetching plot summary for ${id}`);
    const plotHtml = await GetHtmlFromUrl(
      `https://www.imdb.com/title/${id}/plotsummary`,
    );
    console.log(`[IMDB] Plot summary fetched for ${id} (${Date.now() - startTime}ms)`);
    
    const $Plot = cheerio.load(plotHtml);
    const summaries: string[] = [];
    $Plot('[data-testid="sub-section-summaries"]')
      .children()
      .children()
      .each((_, element) => {
        const summary = $Plot(element).text().trim();
        summaries.push(removeSignatures(summary));
      });
    console.log(`[IMDB] Parsed ${summaries.length} summaries for ${id}`);

    console.log(`[IMDB] Fetching main page for ${id}`);
    const mainHtml = await GetHtmlFromUrl(`https://www.imdb.com/title/${id}/`);
    console.log(`[IMDB] Main page fetched for ${id} (${Date.now() - startTime}ms)`);
    
    const $Main = cheerio.load(mainHtml);

    const nextdataScriptString = $Main("#__NEXT_DATA__").html();
    if (!nextdataScriptString) {
      console.error(`[IMDB] #__NEXT_DATA__ script not found for ${id}`);
      throw new Error("IMDB: #__NEXT_DATA__ script not found");
    }
    const nextdataScriptJson = JSON.parse(nextdataScriptString);
    const pageProps =
      nextdataScriptJson?.props?.pageProps?.aboveTheFoldData ?? null;
    if (!pageProps) {
      console.error(`[IMDB] aboveTheFoldData not found in __NEXT_DATA__ for ${id}`);
      throw new Error("IMDB: aboveTheFoldData not found in __NEXT_DATA__");
    }

    const metadataScriptString = $Main(
      'script[type="application/ld+json"]',
    ).html();
    const metadata = metadataScriptString
      ? JSON.parse(metadataScriptString)
      : {};

    const result = FillImdbDetailsResult({
      ...pageProps,
      ...metadata,
      summaries,
    });
    
    const totalDuration = Date.now() - startTime;
    console.log(`[IMDB] Successfully fetched and parsed details for ${id} - Title: "${result.title}" (${totalDuration}ms)`);
    
    return result;
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[IMDB] Error fetching details for ${id} after ${totalDuration}ms:`, error);
    throw new Error(`IMDB parse error for ${id}: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function GetImdbDetailsById(
  id: string,
): Promise<ImdbDetailsResultType> {
  return getOrSetCache(
    GetImdbDetailsByIdUncached(id),
    "parse",
    "imdbDetails",
    { parsedId: id },
    60 * 60 * 24 * 7, // 7 days TTL - IMDB data is relatively stable
  );
}

export async function SearchImdb(
  props: ImdbSearchInputType,
): Promise<SearchResultType[]> {
  const { query, isQuickSearch = false, type = "all", limit = 10 } = props;

  const { meta, title, year } = parseQueryString(query);

  // Note: ScrapingAnt allows only 1 concurrent request, so we must fetch sequentially
  const quickSearchResults: SearchResultType[] = [];
  if (isQuickSearch) {
    const quickSearchHtml = await GetQuickSearchHtml({ type, title, year });
    quickSearchResults.push(
      ...ParseQuickSearch({
        html: quickSearchHtml,
        limit: 4,
      }),
    );
  }

  const advancedSearchHtml = await GetAdvancedSearchHtml({
    type,
    title,
    meta,
    year,
  });
  const advancedSearchResults = ParseAdvancedSearch({
    html: advancedSearchHtml,
    limit: limit,
  });

  const advancedSearchIdsSet = new Set(
    advancedSearchResults.map((result) => result.parsedId),
  );

  return [
    ...quickSearchResults.filter(
      (result) => !advancedSearchIdsSet.has(result.parsedId),
    ),
    ...advancedSearchResults,
  ].slice(0, limit);
}

// #endregion Public Functions
