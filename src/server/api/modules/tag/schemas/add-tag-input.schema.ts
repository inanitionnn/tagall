import { z } from "zod";

export const AddTagInputSchema = z.object({
  name: z.string().min(1).max(255),
  collectionIds: z.array(z.string().cuid()).optional(),
});
