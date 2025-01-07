import { z } from "zod";

export const DeleteItemCommentInputSchema = z.string().cuid();
