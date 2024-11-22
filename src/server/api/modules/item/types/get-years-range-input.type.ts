import { z } from "zod";
import { GetYearsRangeInputSchema } from "../schemas";

export type GetYearsRangeInputType = z.infer<typeof GetYearsRangeInputSchema>;
