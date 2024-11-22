import { z } from "zod";
import { GetFilterFieldsInputSchema } from "../schemas";

export type GetFilterFieldsInputType = z.infer<
  typeof GetFilterFieldsInputSchema
>;
