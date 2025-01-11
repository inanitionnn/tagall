import { type z } from "zod";
import { type UpdateTagInputSchema } from "../schemas";

export type UpdateTagInputType = z.infer<typeof UpdateTagInputSchema>;
