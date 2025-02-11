import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  UpdateItemCommentInputSchema,
  AddItemCommentInputSchema,
  DeleteItemCommentInputSchema,
} from "./schemas";
import {
  UpdateItemComment,
  AddItemComment,
  DeleteItemComment,
} from "./services";
import { deleteCache } from "../../../../lib";

export const ItemCommentRouter = createTRPCRouter({
  addItemComment: protectedProcedure
    .input(AddItemCommentInputSchema)
    .mutation(async (props) => {
      const { ctx } = props;
      const response = await AddItemComment(props);

      await deleteCache("item", "getUserItemsStats", {
        userId: ctx.session.user.id,
      });
      return response;
    }),

  updateItemComment: protectedProcedure
    .input(UpdateItemCommentInputSchema)
    .mutation(async (props) => {
      const { ctx } = props;
      const response = await UpdateItemComment(props);

      await deleteCache("item", "getUserItemsStats", {
        userId: ctx.session.user.id,
      });
      return response;
    }),

  deleteItemComment: protectedProcedure
    .input(DeleteItemCommentInputSchema)
    .mutation(async (props) => {
      const { ctx } = props;
      const response = await DeleteItemComment(props);

      await deleteCache("item", "getUserItemsStats", {
        userId: ctx.session.user.id,
      });
      return response;
    }),
});
