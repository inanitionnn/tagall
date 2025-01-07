import { ItemStatus } from "@prisma/client";
import { z } from "zod";


export const AddItemCommentInputSchema = z.object({
  itemId: z.string().cuid(),
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000).nullable().optional(),
  rate: z.number().int().min(0).max(10).optional(),
  status: z.nativeEnum(ItemStatus).optional(),
});
