export type AnilistSearchResultType = {
  data: {
    data: {
      Page: {
        media: {
          id: number;
          title: {
            english?: string | null;
            romaji?: string | null;
          };
          coverImage: {
            large?: string | null;
          };
          volumes?: number | null;
          genres?: string[] | null;
          tags?: { name: string }[] | null;
          description?: string | null;
          status?: string | null;
          countryOfOrigin?: string | null;
          startDate?: {
            year?: number | null;
          } | null;
          staff?: {
            nodes: {
              name: {
                full?: string | null;
              };
            }[];
          } | null;
        }[];
      };
    };
  };
};
