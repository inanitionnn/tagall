import { z } from "zod";
import { SearchInputSchema } from "../schemas";

export type SearchInputType = z.infer<typeof SearchInputSchema>;
