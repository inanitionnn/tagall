import { z } from "zod";

export const ParseRegrexInputSchema = z.object({
  url: z.string().url(),
  htmlQuery: z.string().min(1).max(100),
  userMessage: z.string().min(1).max(100).optional(),
});
