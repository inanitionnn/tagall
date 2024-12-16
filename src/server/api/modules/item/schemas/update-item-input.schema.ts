import { ItemStatus } from "@prisma/client";
import { z } from "zod";

export const UpdateItemInputSchema = z.object({
  id: z.string().cuid(),
  rate: z.number().int().min(0).max(10),
  status: z.nativeEnum(ItemStatus),
});
