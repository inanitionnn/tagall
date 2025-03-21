import { z } from "zod";

export const UpdateTagInputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(255).optional(),
  collectionsIds: z.array(z.string().cuid()).optional(),
});
