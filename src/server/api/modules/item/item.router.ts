import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  AddToCollectionInputSchema,
  DeleteFromCollectionInputSchema,
  GetRandomUserItemsInputSchema,
  GetUserItemInputSchema,
  GetUserItemsInputSchema,
  GetUserItemsStatsInputSchema,
  GetYearsRangeInputSchema,
  SearchItemByTextInputSchema,
  UpdateItemInputSchema,
} from "./schemas";
import {
  AddToCollection,
  DeleteFromCollection,
  GetRandomUserItems,
  GetUserItem,
  GetUserItems,
  GetUserItemsStats,
  GetYearsRange,
  SearchItemByText,
  UpdateItem,
} from "./services";

export const ItemRouter = createTRPCRouter({
  getUserItems: protectedProcedure
    .input(GetUserItemsInputSchema)
    .query(GetUserItems),

  getRandomUserItems: protectedProcedure
    .input(GetRandomUserItemsInputSchema)
    .query(GetRandomUserItems),

  getUserItemsStats: protectedProcedure
    .input(GetUserItemsStatsInputSchema)
    .query(GetUserItemsStats),

  getUserItem: protectedProcedure
    .input(GetUserItemInputSchema)
    .query(GetUserItem),

  getYearsRange: protectedProcedure
    .input(GetYearsRangeInputSchema)
    .query(GetYearsRange),

  addToCollection: protectedProcedure
    .input(AddToCollectionInputSchema)
    .mutation(AddToCollection),

  updateItem: protectedProcedure
    .input(UpdateItemInputSchema)
    .mutation(UpdateItem),

  deleteFromCollection: protectedProcedure
    .input(DeleteFromCollectionInputSchema)
    .mutation(DeleteFromCollection),

  searchItemByText: protectedProcedure
    .input(SearchItemByTextInputSchema)
    .mutation(SearchItemByText),
});
