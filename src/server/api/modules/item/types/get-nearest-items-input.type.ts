import { type z } from "zod";
import { type GetNearestItemsInputSchema } from "../schemas";

export type GetNearestItemsInputType = z.infer<
  typeof GetNearestItemsInputSchema
>;
