import { type z } from "zod";
import { type AddTagInputSchema } from "../schemas";

export type AddTagInputType = z.infer<typeof AddTagInputSchema>;
