import { z } from "zod";

export const SearchItemByTextInputSchema = z.string().max(1000);
