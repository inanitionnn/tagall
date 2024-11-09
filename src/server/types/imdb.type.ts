export namespace IMDB_TYPES {
  export type ImdbDetailsResult = {
    title: string | null;
    year: {
      release: number | null;
      end: number | null;
    };
    image: string | null;
    plot: string | null;
    keywords: string[];
    people: string[];
    runtime: {
      seconds: number | null;
      text: string | null;
    };
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
    production: string[];
  };

  export type ImdbSearchResult = {
    title: string | null;
    link: string | null;
    image: string | null;
    year: number | null;
  };
}
