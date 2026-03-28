/**
 * Rounds a raw 0–10 rating to 1 decimal place for consistent storage and display.
 * Works for all sources already converted to 0–10 scale:
 *   - TMDB vote_average (e.g. 8.234 → 8.2)
 *   - AniList averageScore / 10 (e.g. 73 / 10 = 7.3 → 7.3)
 */
export function normalizeExternalRating(raw: number): number {
  return Math.round(raw * 10) / 10;
}
