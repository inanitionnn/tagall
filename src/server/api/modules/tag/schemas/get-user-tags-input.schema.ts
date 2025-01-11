import { z } from "zod";

// collection ids
export const GetUserTagsInputSchema = z.array(z.string().cuid()).optional();
