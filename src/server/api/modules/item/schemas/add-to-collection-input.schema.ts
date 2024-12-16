import { ItemStatus } from "@prisma/client";
import { z } from "zod";

export const AddToCollectionInputSchema = z.object({
  id: z.string(),
  collectionId: z.string().cuid(),
  rate: z.number().int().min(0).max(10),
  status: z.nativeEnum(ItemStatus),
  tags: z.array(z.string().cuid()).optional(),
});
