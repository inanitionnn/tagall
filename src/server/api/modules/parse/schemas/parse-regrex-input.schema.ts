import { z } from "zod";

export const ParseRegrexInputSchema = z.object({
  url: z.string().url(),
  htmlQuery: z.string().min(1).max(2000),
  userMessage: z.string().min(1).max(1000).optional(),
  collectionId: z.string().cuid(),
});
