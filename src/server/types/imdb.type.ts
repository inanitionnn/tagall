import { MediaDetailsResult } from "./media.type";

export type ImdbDetailsResult = MediaDetailsResult & {
  type: {
    titleType: string | null;
    isSeries: boolean;
    isEpisode: boolean;
    canHaveEpisodes: boolean;
  };
  contentRating: {
    isAdult: boolean;
    rating: string | null;
  };
  rating: number | null;
  production: {
    companies: string[];
    status: string | null;
  };
};

export type ImdbSearchResult = {
  title: string | null;
  link: string | null;
  image: string | null;
};
