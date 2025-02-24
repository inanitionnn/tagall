import type { z } from "zod";
import type { ParseRegrexInputSchema } from "../schemas";

export type ParseRegrexInputType = z.infer<typeof ParseRegrexInputSchema>;
