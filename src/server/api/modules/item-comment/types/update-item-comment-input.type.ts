import { type z } from 'zod';
import { type UpdateItemCommentInputSchema } from '../schemas';

export type UpdateItemCommentInputType = z.infer<
  typeof UpdateItemCommentInputSchema
>;
