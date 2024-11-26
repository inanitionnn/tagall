import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  AddToUserInputSchema,
  GetUserItemInputSchema,
  GetUserItemsInputSchema,
  GetYearsRangeInputSchema,
} from "./schemas";
import {
  AddToUser,
  GetUserItem,
  GetUserItems,
  GetYearsRange,
} from "./services";

export const ItemRouter = createTRPCRouter({
  getUserItems: protectedProcedure
    .input(GetUserItemsInputSchema)
    .query(GetUserItems),

  getUserItem: protectedProcedure
    .input(GetUserItemInputSchema)
    .query(GetUserItem),

  getYearsRange: protectedProcedure
    .input(GetYearsRangeInputSchema)
    .query(GetYearsRange),

  addToUser: protectedProcedure.input(AddToUserInputSchema).mutation(AddToUser),
});
