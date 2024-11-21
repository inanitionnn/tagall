import { z } from "zod";
import { AddToUserInputSchema } from "../schemas";

export type AddToUserInputType = z.infer<typeof AddToUserInputSchema>;
