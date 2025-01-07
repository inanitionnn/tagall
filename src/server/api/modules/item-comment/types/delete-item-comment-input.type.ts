import { type z } from 'zod';
import { type DeleteItemCommentInputSchema } from '../schemas';

export type DeleteItemCommentInputType = z.infer<
  typeof DeleteItemCommentInputSchema
>;
