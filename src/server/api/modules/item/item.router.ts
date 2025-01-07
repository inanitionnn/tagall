import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import {
  AddToCollectionInputSchema,
  DeleteFromCollectionInputSchema,
  GetUserItemInputSchema,
  GetUserItemsInputSchema,
  GetYearsRangeInputSchema,
  UpdateItemInputSchema,
} from './schemas';
import {
  AddToCollection,
  DeleteFromCollection,
  GetUserItem,
  GetUserItems,
  GetYearsRange,
  UpdateItem,
} from './services';

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

  addToCollection: protectedProcedure
    .input(AddToCollectionInputSchema)
    .mutation(AddToCollection),

  updateItem: protectedProcedure
    .input(UpdateItemInputSchema)
    .mutation(UpdateItem),

  deleteFromCollection: protectedProcedure
    .input(DeleteFromCollectionInputSchema)
    .mutation(DeleteFromCollection),
});
