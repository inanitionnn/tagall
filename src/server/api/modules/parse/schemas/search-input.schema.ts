import { z } from "zod";

export const SearchInputSchema = z.object({
  query: z.string().min(1).max(100),
  collectionId: z.union([z.string().cuid(), z.literal("all")]),
  limit: z.number().int().min(1).max(30).optional(),
  isAdvancedSearch: z.boolean().optional(),
});
