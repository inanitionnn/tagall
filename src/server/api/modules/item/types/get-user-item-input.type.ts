import { z } from "zod";
import { GetUserItemInputSchema } from "../schemas";

export type GetUserItemInputType = z.infer<typeof GetUserItemInputSchema>;
