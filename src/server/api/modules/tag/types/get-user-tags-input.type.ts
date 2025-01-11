import { type z } from "zod";
import { type GetUserTagsInputSchema } from "../schemas";

export type GetUserTagsInputType = z.infer<typeof GetUserTagsInputSchema>;
