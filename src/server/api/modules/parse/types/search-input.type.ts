import type { z } from "zod";
import type { SearchInputSchema } from "../schemas";

export type SearchInputType = z.infer<typeof SearchInputSchema>;
