/**
 * Backfill script: fetches external ratings for all Item rows that have
 * externalRating = null and writes the normalized value back to the DB.
 *
 * Usage:
 *   pnpm add -D tsx                          (install runner once)
 *   node --env-file=.env node_modules/.bin/tsx scripts/backfill-external-ratings.ts
 *   node --env-file=.env node_modules/.bin/tsx scripts/backfill-external-ratings.ts --dry-run
 *
 * Rate limits (free tiers):
 *   TMDB    : 40 req/10 s  →  2 req/item  →  700 ms delay  (≈ 2.8 req/s, safe)
 *   AniList : 90 req/min   →  1 req/item  →  750 ms delay  (≈ 1.33 req/s, safe)
 *
 * Time estimate for ~2 k items: ≈ 25 minutes.
 * Resumable: items already having externalRating are skipped automatically.
 */

import { PrismaClient } from "@prisma/client";
import axios from "axios";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const TMDB_DELAY_MS = 700;
const ANILIST_DELAY_MS = 750;

const TMDB_BASE = "https://api.themoviedb.org/3";
const ANILIST_URL = "https://graphql.anilist.co";

const isDryRun = process.argv.includes("--dry-run");

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Items with a purely numeric parsedId come from AniList (manga). */
function isAnilistItem(parsedId: string): boolean {
  return /^\d+$/.test(parsedId);
}

/** Rounds a raw 0–10 value to 1 decimal place. */
function normalizeRating(raw: number): number {
  return Math.round(raw * 10) / 10;
}

function getTmdbAuthHeaders(): Record<string, string> {
  if (process.env.TMDB_ACCESS_TOKEN) {
    return { Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}` };
  }
  return {};
}

function getTmdbAuthParams(): Record<string, string> {
  if (!process.env.TMDB_ACCESS_TOKEN && process.env.TMDB_API_KEY) {
    return { api_key: process.env.TMDB_API_KEY };
  }
  return {};
}

// ---------------------------------------------------------------------------
// TMDB: 2 requests per item
//   1. /find/{imdbId}?external_source=imdb_id  →  tmdbId + mediaType
//   2. /movie/{id} or /tv/{id}                 →  vote_average
// ---------------------------------------------------------------------------

type TmdbFindResponse = {
  movie_results: Array<{ id: number; vote_average?: number }>;
  tv_results: Array<{ id: number; vote_average?: number }>;
};

type TmdbDetailsResponse = {
  vote_average?: number | null;
};

async function fetchTmdbRating(parsedId: string): Promise<number | null> {
  const id = parsedId.startsWith("tt") ? parsedId : `tt${parsedId}`;

  const findRes = await axios.get<TmdbFindResponse>(`${TMDB_BASE}/find/${id}`, {
    headers: getTmdbAuthHeaders(),
    params: { ...getTmdbAuthParams(), external_source: "imdb_id" },
    timeout: 15_000,
  });

  const movie = findRes.data.movie_results?.[0];
  const tv = findRes.data.tv_results?.[0];

  if (!movie && !tv) return null;

  const mediaType = movie ? "movie" : "tv";
  const tmdbId = (movie ?? tv)!.id;

  const detailsRes = await axios.get<TmdbDetailsResponse>(
    `${TMDB_BASE}/${mediaType}/${tmdbId}`,
    {
      headers: getTmdbAuthHeaders(),
      params: getTmdbAuthParams(),
      timeout: 15_000,
    },
  );

  const voteAverage = detailsRes.data.vote_average;
  return voteAverage != null ? voteAverage : null;
}

// ---------------------------------------------------------------------------
// AniList: 1 request per item
// ---------------------------------------------------------------------------

const ANILIST_RATING_QUERY = `
query ($mediaId: Int) {
  Media(id: $mediaId) {
    averageScore
  }
}`;

type AnilistRatingResponse = {
  data: {
    Media: {
      averageScore: number | null;
    };
  };
};

async function fetchAnilistRating(parsedId: string): Promise<number | null> {
  const res = await axios.post<AnilistRatingResponse>(
    ANILIST_URL,
    {
      query: ANILIST_RATING_QUERY,
      variables: { mediaId: parseInt(parsedId, 10) },
    },
    {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      timeout: 15_000,
    },
  );

  const score = res.data?.data?.Media?.averageScore;
  return score != null ? score / 10 : null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (isDryRun) {
    console.log("[backfill] DRY RUN — no writes will be performed\n");
  }

  if (!process.env.TMDB_ACCESS_TOKEN && !process.env.TMDB_API_KEY) {
    console.error(
      "[backfill] ERROR: Set TMDB_ACCESS_TOKEN or TMDB_API_KEY in your .env file",
    );
    process.exit(1);
  }

  const items = await prisma.item.findMany({
    where: { externalRating: null },
    select: { id: true, parsedId: true, title: true },
    orderBy: { createdAt: "asc" },
  });

  const total = items.length;
  console.log(`[backfill] Found ${total} items without externalRating\n`);

  if (total === 0) {
    console.log("[backfill] Nothing to do. Exiting.");
    await prisma.$disconnect();
    return;
  }

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const isAnilist = isAnilistItem(item.parsedId);
    const prefix = `[${String(i + 1).padStart(String(total).length, " ")}/${total}]`;

    try {
      const rawRating = isAnilist
        ? await fetchAnilistRating(item.parsedId)
        : await fetchTmdbRating(item.parsedId);

      if (rawRating == null) {
        skipped++;
        console.log(`${prefix} SKIP  (no rating available) — ${item.title} (${item.parsedId})`);
      } else {
        const rating = normalizeRating(rawRating);

        if (!isDryRun) {
          await prisma.item.update({
            where: { id: item.id },
            data: { externalRating: rating },
          });
        }

        updated++;
        const tag = isDryRun ? "DRY" : "OK ";
        console.log(`${prefix} ${tag}   ${rating} — ${item.title} (${item.parsedId})`);
      }
    } catch (err) {
      errors++;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`${prefix} ERROR — ${item.title} (${item.parsedId}): ${message}`);
    }

    // Rate-limiting delay (skip after the last item)
    if (i < items.length - 1) {
      await sleep(isAnilist ? ANILIST_DELAY_MS : TMDB_DELAY_MS);
    }
  }

  console.log(
    `\n[backfill] Done.  Updated: ${updated}  |  Skipped (no data): ${skipped}  |  Errors: ${errors}`,
  );

  if (isDryRun) {
    console.log("[backfill] DRY RUN — no rows were actually updated.");
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("[backfill] Fatal error:", err);
  process.exitCode = 1;
  void prisma.$disconnect();
});
