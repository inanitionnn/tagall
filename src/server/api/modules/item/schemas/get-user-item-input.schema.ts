import { z } from "zod";

export const GetUserItemInputSchema = z.string().cuid();
