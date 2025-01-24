export type SearchType = "film" | "series" | "all";

export type SearchQuery = {
  meta: string | null;
  title: string;
  year: number | null;
};

export type ImdbSearchInputType = {
  query: string;
  type?: SearchType;
  limit?: number;
};
