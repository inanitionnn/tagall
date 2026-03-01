/**
 * Minimal shape of IMDB title page JSON-LD (schema.org Movie / TVSeries).
 * Used for type-safe extraction without parsing full schema.
 */
export type ImdbJsonLdActor = {
  "@type"?: string;
  name?: string;
};

export type ImdbJsonLdAggregateRating = {
  ratingValue?: string;
  bestRating?: string;
  ratingCount?: string;
};

export type ImdbJsonLdMovieOrTv = {
  "@type"?: string;
  name?: string;
  description?: string;
  contentRating?: string;
  aggregateRating?: ImdbJsonLdAggregateRating;
  actor?: ImdbJsonLdActor[];
};
