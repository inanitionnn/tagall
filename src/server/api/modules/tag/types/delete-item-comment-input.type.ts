import { type z } from "zod";
import { type DeleteTagInputSchema } from "../schemas";

export type DeleteTagInputType = z.infer<typeof DeleteTagInputSchema>;
