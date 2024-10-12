import { MediaDetailsResult } from "./media.type";

export type WikiDetailsResult = MediaDetailsResult & {
  country: string[];
};

export type WikiSearchResult = {
  title: string | null;
  image: string | null;
  year: {
    release: number | null;
    end: number | null;
  };
  url: string | null;
};
