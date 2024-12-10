import { type z } from "zod";
import { type GetYearsRangeInputSchema } from "../schemas";

export type GetYearsRangeInputType = z.infer<typeof GetYearsRangeInputSchema>;
