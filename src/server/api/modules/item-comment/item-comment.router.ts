import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import {
  UpdateItemCommentInputSchema,
  AddItemCommentInputSchema,
  DeleteItemCommentInputSchema,
} from './schemas';
import {
  UpdateItemComment,
  AddItemComment,
  DeleteItemComment,
} from './services';

export const ItemCommentRouter = createTRPCRouter({
  addItemComment: protectedProcedure
    .input(AddItemCommentInputSchema)
    .query(AddItemComment),

  updateItemComment: protectedProcedure
    .input(UpdateItemCommentInputSchema)
    .mutation(UpdateItemComment),

  deleteItemComment: protectedProcedure
    .input(DeleteItemCommentInputSchema)
    .mutation(DeleteItemComment),
});
