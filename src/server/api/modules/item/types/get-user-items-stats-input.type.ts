import { type z } from "zod";
import { type GetUserItemsStatsInputSchema } from "../schemas";

export type GetUserItemsStatsInputType = z.infer<
  typeof GetUserItemsStatsInputSchema
>;
