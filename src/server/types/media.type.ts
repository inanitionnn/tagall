export type MediaDetailsResult = {
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
  } | null;
};
