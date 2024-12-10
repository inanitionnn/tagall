import { type z } from "zod";
import {
  type GetUserItemsFilterSchema,
  type GetUserItemsInputSchema,
  type GetUserItemsSortSchema,
} from "../schemas";

export type GetUserItemsFilterType = z.infer<typeof GetUserItemsFilterSchema>;
export type GetUserItemsSortType = z.infer<typeof GetUserItemsSortSchema>;
export type GetUserItemsInputType = z.infer<typeof GetUserItemsInputSchema>;
