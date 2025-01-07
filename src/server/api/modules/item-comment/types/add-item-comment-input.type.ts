import { type z } from "zod";
import { type AddItemCommentInputSchema } from "../schemas";

export type AddItemCommentInputType = z.infer<
  typeof AddItemCommentInputSchema
>;
