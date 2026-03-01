/**
 * Data extracted from IMDB title page (JSON-LD + HTML) used to enrich TMDB base details.
 * All fields are optional; only present values are merged into ImdbDetailsResultType.
 */
export type ImdbEnrichmentData = {
  description?: string | null;
  rating?: number | null;
  contentRating?: string | null;
  people?: string[];
  keywords?: string[];
  production?: string[];
};
