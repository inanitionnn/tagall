import { z } from "zod";

export const DeleteTagInputSchema = z.string().cuid();
