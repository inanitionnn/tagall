import type { z } from "zod";
import type { UpdateUserInputSchema } from "../schemas";

export type UpdateUserInputType = z.infer<typeof UpdateUserInputSchema>;
