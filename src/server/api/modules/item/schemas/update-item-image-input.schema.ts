import { z } from "zod";

export const UpdateItemImageInputSchema = z
  .object({
    id: z.string().cuid(),
    imageUrl: z.string().url().optional(),
    imageBase64: z.string().optional(),
  })
  .refine((data) => data.imageUrl || data.imageBase64, {
    message: "Either imageUrl or imageBase64 must be provided",
  });
