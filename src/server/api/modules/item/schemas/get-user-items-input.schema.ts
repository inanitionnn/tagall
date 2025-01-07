import { ItemStatus } from "@prisma/client";
import { z } from "zod";

export const GetUserItemsFilterSchema = z.array(
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
  ]),
);

export const GetUserItemsSortSchema = z.object({
  name: z.enum(["rate", "status", "date", "year"]),
  type: z.enum(["asc", "desc"]),
});

export const GetUserItemsInputSchema = z
  .object({
    page: z.number().int().min(1).optional(),
    limit: z.number().int().max(100).min(1).optional(),
    collectionsIds: z.array(z.string().cuid()).optional(),
    filtering: GetUserItemsFilterSchema.optional(),
    sorting: GetUserItemsSortSchema.optional(),
    search: z.string().optional(),
  })
  .optional();
