import { type z } from "zod";
import { type UpdateItemImageInputSchema } from "../schemas";

export type UpdateItemImageInputType = z.infer<typeof UpdateItemImageInputSchema>;
