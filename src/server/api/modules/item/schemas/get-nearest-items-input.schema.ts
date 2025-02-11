import { z } from "zod";

export const GetNearestItemsInputSchema = z.object({
  limit: z.number().int().max(20).min(1).default(10),
  itemId: z.string().cuid(),
});
