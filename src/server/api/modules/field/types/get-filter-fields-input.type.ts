import { type z } from "zod";
import { type GetFilterFieldsInputSchema } from "../schemas";

export type GetFilterFieldsInputType = z.infer<
  typeof GetFilterFieldsInputSchema
>;
