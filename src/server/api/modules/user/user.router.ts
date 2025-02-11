import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetUser, UpdateUser } from "./services";
import { UpdateUserInputSchema } from "./schemas";
import { deleteCache, getOrSetCache } from "../../../../lib";

export const UserRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async (props) => {
    const { ctx } = props;
    const response = await getOrSetCache(GetUser(props), "user", "getUser", {
      userId: ctx.session.user.id,
    });
    return response;
  }),

  updateUser: protectedProcedure
    .input(UpdateUserInputSchema)
    .mutation(async (props) => {
      const { ctx } = props;
      const response = await UpdateUser(props);
      await deleteCache("user", "getUser", {
        userId: ctx.session.user.id,
      });
      return response;
    }),
});
