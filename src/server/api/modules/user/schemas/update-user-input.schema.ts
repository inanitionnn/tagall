import { z } from "zod";

export const UpdateUserInputSchema = z.object({
  name: z.string().min(3).max(255),
  image: z.string().nullable().optional(),
});
