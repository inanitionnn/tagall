export type SearchResultType = {
  title: string | null;
  image: string | null;
  year: number | null;
  description: string | null;
  keywords: string[];
  parsedId: string;
  inCollection: boolean;
};
