import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import {
  AddToCollectionInputSchema,
  DeleteFromCollectionInputSchema,
  GetNearestItemsInputSchema,
  GetRandomUserItemsInputSchema,
  GetUserItemInputSchema,
  GetUserItemsInputSchema,
  GetAllUserItemsInputSchema,
  GetUserItemsStatsInputSchema,
  GetYearsRangeInputSchema,
  SearchItemByTextInputSchema,
  UpdateItemInputSchema,
  UpdateItemImageInputSchema,
} from "./schemas";
import {
  AddToCollection,
  DeleteFromCollection,
  GetNearestItems,
  GetRandomUserItems,
  GetUserItem,
  GetUserItems,
  GetAllUserItems,
  GetUserItemsStats,
  GetYearsRange,
  SearchItemByText,
  UpdateItem,
  UpdateItemImage,
} from "./services";
import { getOrSetCache } from "../../../../lib";
import { getFirstAllowedUser } from "../../helpers";
import { invalidateItemCaches } from "./utils/cache-invalidation.util";

export const ItemRouter = createTRPCRouter({
  getUserItems: protectedProcedure
    .input(GetUserItemsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;

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

  getAllUserItems: protectedProcedure
    .input(GetAllUserItemsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;

      const response = await getOrSetCache(
        GetAllUserItems(props),
        "item",
        "getAllUserItems",
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
      const { ctx, input } = props;
      const response = await AddToCollection(props);

      await invalidateItemCaches(ctx.session.user.id, {
        collectionsIds: [input.collectionId],
        includeSearch: true,
      });

      return response;
    }),

  updateItem: protectedProcedure
    .input(UpdateItemInputSchema)
    .mutation(async (props) => {
      const { ctx, input } = props;
      const response = await UpdateItem(props);

      await invalidateItemCaches(ctx.session.user.id, {
        itemId: input.id,
      });
      
      return response;
    }),

  updateItemImage: protectedProcedure
    .input(UpdateItemImageInputSchema)
    .mutation(async (props) => {
      const { ctx, input } = props;
      const response = await UpdateItemImage(props);

      await invalidateItemCaches(ctx.session.user.id, {
        itemId: input.id,
      });
      
      return response;
    }),

  deleteFromCollection: protectedProcedure
    .input(DeleteFromCollectionInputSchema)
    .mutation(async (props) => {
      const { ctx, input } = props;
      const response = await DeleteFromCollection(props);

      await invalidateItemCaches(ctx.session.user.id, {
        itemId: input,
        includeSearch: true,
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

  getPublicUserItems: publicProcedure
    .input(GetUserItemsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const user = await getFirstAllowedUser(ctx.db);
      if (!user) {
        throw new Error("Public user not found");
      }

      const publicCtx = {
        ...ctx,
        session: {
          user: { id: user.id, email: user.email, name: user.name },
          expires: "",
        },
      };

      const response = await getOrSetCache(
        GetUserItems({ ctx: publicCtx, input }),
        "item",
        "getPublicUserItems",
        {
          userId: user.id,
          input,
        },
      );

      return response;
    }),

  getPublicAllUserItems: publicProcedure
    .input(GetAllUserItemsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const user = await getFirstAllowedUser(ctx.db);
      if (!user) {
        throw new Error("Public user not found");
      }

      const publicCtx = {
        ...ctx,
        session: {
          user: { id: user.id, email: user.email, name: user.name },
          expires: "",
        },
      };

      const response = await getOrSetCache(
        GetAllUserItems({ ctx: publicCtx, input }),
        "item",
        "getPublicAllUserItems",
        {
          userId: user.id,
          input,
        },
      );

      return response;
    }),

  getPublicRandomUserItems: publicProcedure
    .input(GetRandomUserItemsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const user = await getFirstAllowedUser(ctx.db);
      if (!user) {
        throw new Error("Public user not found");
      }

      const publicCtx = {
        ...ctx,
        session: {
          user: { id: user.id, email: user.email, name: user.name },
          expires: "",
        },
      };

      return GetRandomUserItems({ ctx: publicCtx, input });
    }),

  getPublicUserItemsStats: publicProcedure
    .input(GetUserItemsStatsInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const user = await getFirstAllowedUser(ctx.db);
      if (!user) {
        throw new Error("Public user not found");
      }

      const publicCtx = {
        ...ctx,
        session: {
          user: { id: user.id, email: user.email, name: user.name },
          expires: "",
        },
      };

      const response = await getOrSetCache(
        GetUserItemsStats({ ctx: publicCtx, input }),
        "item",
        "getPublicUserItemsStats",
        {
          userId: user.id,
          input,
        },
      );

      return response;
    }),

  getPublicYearsRange: publicProcedure
    .input(GetYearsRangeInputSchema)
    .query(async (props) => {
      const { ctx, input } = props;
      const user = await getFirstAllowedUser(ctx.db);
      if (!user) {
        throw new Error("Public user not found");
      }

      const publicCtx = {
        ...ctx,
        session: {
          user: { id: user.id, email: user.email, name: user.name },
          expires: "",
        },
      };

      const response = await getOrSetCache(
        GetYearsRange({ ctx: publicCtx, input }),
        "item",
        "getPublicYearsRange",
        {
          userId: user.id,
          input,
        },
      );

      return response;
    }),
});
