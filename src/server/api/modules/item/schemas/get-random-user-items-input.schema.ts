import { ItemStatus } from "@prisma/client";
import { z } from "zod";

export const GetRandomUserItemsFilterSchema = z.array(
  z.union([
    z.object({
      name: z.literal("rate"),
      type: z.enum(["to", "from"]),
      value: z.number().min(0).max(10),
    }),
    z.object({
      name: z.literal("status"),
      type: z.enum(["include", "exclude"]),
      value: z.nativeEnum(ItemStatus),
    }),
    z.object({
      name: z.literal("year"),
      type: z.enum(["to", "from"]),
      value: z.number().min(0).max(2100),
    }),
    z.object({
      name: z.literal("field"),
      type: z.enum(["include", "exclude"]),
      fieldId: z.string().cuid(),
      value: z.string(),
    }),
    z.object({
      name: z.literal("tag"),
      type: z.enum(["include", "exclude"]),
      tagId: z.string().cuid(),
      value: z.string(),
    }),
  ]),
);

export const GetRandomUserItemsSortSchema = z.object({
  name: z.enum(["rate", "status", "date", "year", "title"]),
  type: z.enum(["asc", "desc"]),
});

export const GetRandomUserItemsInputSchema = z
  .object({
    limit: z.number().int().max(100).min(1).optional(),
    collectionsIds: z.array(z.string().cuid()).optional(),
    filtering: GetRandomUserItemsFilterSchema.optional(),
  })
  .optional();
