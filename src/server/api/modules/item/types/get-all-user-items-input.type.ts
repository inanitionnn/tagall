import { type z } from "zod";
import { type GetAllUserItemsInputSchema } from "../schemas";

export type GetAllUserItemsInputType = z.infer<
  typeof GetAllUserItemsInputSchema
>;
