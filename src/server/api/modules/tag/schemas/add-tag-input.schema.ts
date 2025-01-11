import { z } from "zod";

export const AddTagInputSchema = z.object({
  name: z.string().min(1).max(255),
  collectionsIds: z.array(z.string().cuid()).optional(),
});
