import { type z } from "zod";
import { type GetItemDetailFieldsInputSchema } from "../schemas";

export type GetItemDetailFieldsInputType = z.infer<
  typeof GetItemDetailFieldsInputSchema
>;
