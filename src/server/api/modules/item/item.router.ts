import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  AddToCollectionInputSchema,
  DeleteFromCollectionInputSchema,
  GetNearestItemsInputSchema,
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
  GetNearestItems,
  GetRandomUserItems,
  GetUserItem,
  GetUserItems,
  GetUserItemsStats,
  GetYearsRange,
  SearchItemByText,
  UpdateItem,
} from "./services";
import { deleteCache, getOrSetCache } from "../../../../lib";

export const ItemRouter = createTRPCRouter({
  getUserItems: protectedProcedure
    .input(GetUserItemsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;

      if (input?.sorting?.name === "date") {
        return GetUserItems(props);
      }

      const response = await getOrSetCache(
        GetUserItems(props),
        "item",
        "getUserItems",
        {
          userId: ctx.session.user.id,
          input,
        },
      );

      return response;
    }),

  getRandomUserItems: protectedProcedure
    .input(GetRandomUserItemsInputSchema)
    .query(GetRandomUserItems),

  getUserItemsStats: protectedProcedure
    .input(GetUserItemsStatsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const response = await getOrSetCache(
        GetUserItemsStats(props),
        "item",
        "getUserItemsStats",
        {
          userId: ctx.session.user.id,
          input,
        },
      );
      return response;
    }),

  getUserItem: protectedProcedure
    .input(GetUserItemInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const response = await getOrSetCache(
        GetUserItem(props),
        "item",
        "getUserItem",
        {
          userId: ctx.session.user.id,
          input,
        },
      );
      return response;
    }),

  getNearestItems: protectedProcedure
    .input(GetNearestItemsInputSchema)
    .query(async (props) => {
      const { input } = props;
      const response = await getOrSetCache(
        GetNearestItems(props),
        "item",
        "getNearestItems",
        {
          input,
        },
      );
      return response;
    }),

  getYearsRange: protectedProcedure
    .input(GetYearsRangeInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const response = await getOrSetCache(
        GetYearsRange(props),
        "item",
        "getYearsRange",
        {
          userId: ctx.session.user.id,
          input,
        },
      );
      return response;
    }),

  addToCollection: protectedProcedure
    .input(AddToCollectionInputSchema)
    .mutation(async (props) => {
      const { ctx } = props;
      const response = await AddToCollection(props);
      await deleteCache("parse", "regrex", {
        userId: ctx.session.user.id,
      });
      await deleteCache("parse", "search", {
        userId: ctx.session.user.id,
      });
      await deleteCache("item", "getUserItems", {
        userId: ctx.session.user.id,
      });
      await deleteCache("item", "getYearsRange", {
        userId: ctx.session.user.id,
      });
      await deleteCache("item", "getNearestItems");
      return response;
    }),

  updateItem: protectedProcedure
    .input(UpdateItemInputSchema)
    .mutation(async (props) => {
      const { ctx, input } = props;
      const response = await UpdateItem(props);

      await deleteCache("item", "getUserItems", {
        userId: ctx.session.user.id,
      });
      await deleteCache("item", "getUserItem", {
        userId: ctx.session.user.id,
        input: input.id,
      });
      await deleteCache("item", "getUserItemsStats", {
        userId: ctx.session.user.id,
      });
      return response;
    }),

  deleteFromCollection: protectedProcedure
    .input(DeleteFromCollectionInputSchema)
    .mutation(async (props) => {
      const { ctx, input } = props;
      const response = await DeleteFromCollection(props);

      await deleteCache("parse", "regrex", {
        userId: ctx.session.user.id,
      });
      await deleteCache("parse", "search", {
        userId: ctx.session.user.id,
      });
      await deleteCache("item", "getYearsRange", {
        userId: ctx.session.user.id,
      });
      await deleteCache("item", "getUserItem", {
        userId: ctx.session.user.id,
        input,
      });
      await deleteCache("item", "getUserItemsStats", {
        userId: ctx.session.user.id,
      });
      return response;
    }),

  searchItemByText: protectedProcedure
    .input(SearchItemByTextInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const response = await getOrSetCache(
        SearchItemByText(props),
        "item",
        "searchItemByText",
        {
          userId: ctx.session.user.id,
          input,
        },
      );
      return response;
    }),
});
