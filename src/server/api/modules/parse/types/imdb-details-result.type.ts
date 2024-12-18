export type ImdbDetailsResultType = {
  title: string | null;
  year: number | null;
  image: string | null;
  description: string | null;
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
