import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetUser, UpdateUser } from "./services";
import { UpdateUserInputSchema } from "./schemas";

export const UserRouter = createTRPCRouter({
  getUser: protectedProcedure.query(GetUser),

  updateUser: protectedProcedure
    .input(UpdateUserInputSchema)
    .mutation(UpdateUser),
});
