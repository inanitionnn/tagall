import { z } from "zod";

export const GetYearsRangeInputSchema = z.array(z.string().cuid()).default([]);
