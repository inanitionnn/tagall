import { z } from "zod";

export const SearchItemByTextInputSchema = z.string().min(1).max(1000);
