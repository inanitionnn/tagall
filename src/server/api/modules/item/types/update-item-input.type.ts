import { type z } from "zod";
import { type UpdateItemInputSchema } from "../schemas";

export type UpdateItemInputType = z.infer<typeof UpdateItemInputSchema>;
