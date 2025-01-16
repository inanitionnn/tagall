import { type z } from "zod";
import type { SearchItemByTextInputSchema } from "../schemas";

export type SearchItemByTextInputSchema = z.infer<
  typeof SearchItemByTextInputSchema
>;
