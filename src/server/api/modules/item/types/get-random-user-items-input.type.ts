import { type z } from "zod";
import type {
  GetRandomUserItemsFilterSchema,
  GetRandomUserItemsSortSchema,
  GetRandomUserItemsInputSchema,
} from "../schemas";

export type GetRandomUserItemsFilterType = z.infer<
  typeof GetRandomUserItemsFilterSchema
>;
export type GetRandomUserItemsSortType = z.infer<
  typeof GetRandomUserItemsSortSchema
>;
export type GetRandomUserItemsInputType = z.infer<
  typeof GetRandomUserItemsInputSchema
>;
