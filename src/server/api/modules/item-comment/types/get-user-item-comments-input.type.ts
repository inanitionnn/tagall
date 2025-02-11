import { type z } from "zod";
import { type GetUserItemCommentsInputSchema } from "../schemas";

export type GetUserItemCommentsInputType = z.infer<
  typeof GetUserItemCommentsInputSchema
>;
