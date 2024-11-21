import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AddToUserInputSchema, GetUserItemsSchema } from "./schemas";
import { AddToUser, GetUserItems } from "./services";

export const ItemRouter = createTRPCRouter({
  getUserItems: protectedProcedure
    .input(GetUserItemsSchema)
    .query(async (props) => GetUserItems(props)),

  addToUser: protectedProcedure
    .input(AddToUserInputSchema)
    .mutation(async (props) => AddToUser(props)),
});
