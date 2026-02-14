import { z } from "zod";
import { GetUserItemsInputSchema } from "../../../../../server/api/modules/item/schemas";

export const PublicHomeParamsSchema = GetUserItemsInputSchema._def.innerType
  .pick({ collectionsIds: true, filtering: true, sorting: true })
  .extend({
    viewMode: z.enum(["standard", "tierlist", "random"]).default("standard"),
    itemView: z.enum(["poster", "hover", "title"]).optional(),
    limit: z.number().min(1).max(20).optional(),
  })
  .default({});

export type PublicHomeParamsType = z.infer<typeof PublicHomeParamsSchema>;
