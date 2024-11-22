import { z } from "zod";
import {
  GetUserItemsFilterSchema,
  GetUserItemsInputSchema,
  GetUserItemsSortSchema,
} from "../schemas";

export type GetUserItemsFilterType = z.infer<typeof GetUserItemsFilterSchema>;
export type GetUserItemsSortType = z.infer<typeof GetUserItemsSortSchema>;
export type GetUserItemsInputType = z.infer<typeof GetUserItemsInputSchema>;
