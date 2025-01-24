import { z } from "zod";

export const SearchInputSchema = z.object({
  query: z.string().min(1).max(100),
  collectionId: z.string().cuid(),
  limit: z.number().int().min(1).max(100).optional(),
  isAdvancedSearch: z.boolean().optional(),
});
