import { ItemStatus } from "@prisma/client";
import { z } from "zod";

export const AddToCollectionInputSchema = z.object({
  parsedId: z.string(),
  collectionId: z.string().cuid(),
  rate: z.number().int().min(0).max(10),
  status: z.nativeEnum(ItemStatus),
  comment: z
    .object({
      title: z.string().min(1).max(255),
      description: z.string().min(1).max(1000).nullable().optional(),
    })
    .optional(),
  // tags: z.array(z.string().cuid()).optional(),
});
