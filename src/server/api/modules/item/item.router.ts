import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  AddToUserInputSchema,
  GetUserItemsInputSchema,
  GetYearsRangeInputSchema,
} from "./schemas";
import { AddToUser, GetUserItems, GetYearsRange } from "./services";

export const ItemRouter = createTRPCRouter({
  getUserItems: protectedProcedure
    .input(GetUserItemsInputSchema)
    .query(GetUserItems),

  getYearsRange: protectedProcedure
    .input(GetYearsRangeInputSchema)
    .query(GetYearsRange),

  addToUser: protectedProcedure.input(AddToUserInputSchema).mutation(AddToUser),
});
