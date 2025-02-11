import { z } from "zod";

export const GetUserItemCommentsInputSchema = z.string().cuid();
