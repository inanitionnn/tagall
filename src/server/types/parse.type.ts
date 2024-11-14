export namespace PARSE_TYPES {
  export type ImdbDetailsResult = {
    title: string | null;
    year: number | null;
    image: string | null;
    plot: string | null;
    keyword: string[];
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

  export type SearchResult = {
    title: string | null;
    link: string | null;
    image: string | null;
    year: number | null;
    description: string | null;
    keywords: string[];
  };
}
