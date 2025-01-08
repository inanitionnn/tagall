export type SearchResultType = {
  id: string | null;
  title: string | null;
  image: string | null;
  year: number | null;
  description: string | null;
  keywords: string[];
  parsedId: string;
};
