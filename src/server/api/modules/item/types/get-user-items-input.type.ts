import { z } from "zod";
import { GetUserItemsSchema } from "../schemas";

export type GetUserItemsInputType = z.infer<typeof GetUserItemsSchema>;
