export type AnilistDetailsResultType = {
  data: {
    data: {
      Media: {
        id: number;
        title: {
          english?: string | null;
          romaji?: string | null;
        };
        coverImage: {
          extraLarge?: string | null;
          large?: string | null;
          medium?: string | null;
        };
        genres?: string[] | null;
        volumes?: number | null;
        tags?: { name: string }[] | null;
        description?: string | null;
        status?: string | null;
        countryOfOrigin?: string | null;
        startDate?: {
          year?: number | null;
        } | null;
        chapters?: number | null;
        staff?: {
          nodes: {
            name: {
              full?: string | null;
            };
          }[];
        } | null;
      };
    };
  };
};
