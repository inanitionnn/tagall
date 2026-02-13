import { z } from "zod";
import {
  GetUserItemsFilterSchema,
  GetUserItemsSortSchema,
} from "./get-user-items-input.schema";

export const GetAllUserItemsInputSchema = z
  .object({
    collectionsIds: z.array(z.string().cuid()).optional(),
    filtering: GetUserItemsFilterSchema.optional(),
    sorting: GetUserItemsSortSchema.optional(),
    search: z.string().optional(),
  })
  .default({});
