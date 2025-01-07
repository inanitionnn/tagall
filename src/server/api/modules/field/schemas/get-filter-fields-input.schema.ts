import { z } from "zod";

export const GetFilterFieldsInputSchema = z.array(z.string().cuid()).optional();
