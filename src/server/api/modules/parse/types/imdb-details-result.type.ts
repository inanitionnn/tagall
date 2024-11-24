export type ImdbDetailsResultType = {
  title: string | null;
  year: number | null;
  image: string | null;
  plot: string | null;
  genres: string[];
  keywords: string[];
  people: string[];
  runtime: string | null;
  type: {
    titleType: string | null;
    isSeries: boolean;
    isEpisode: boolean;
    canHaveEpisodes: boolean;
  };
  isAdult: boolean;
  contentRating: string | null;
  rating: number | null;
  production: string[];
};
