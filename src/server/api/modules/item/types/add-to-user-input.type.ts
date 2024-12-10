import { type z } from "zod";
import { type AddToUserInputSchema } from "../schemas";

export type AddToUserInputType = z.infer<typeof AddToUserInputSchema>;
