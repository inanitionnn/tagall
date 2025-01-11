import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { CollectionRouter } from "./modules/collection/collection.router";
import { ParseRouter } from "./modules/parse/parse.router";
import { FieldRouter } from "./modules/field/field.router";
import { ItemRouter } from "./modules/item/item.router";
import { EmbeddingRouter } from "./modules/embedding/parse.router";
import { ItemCommentRouter } from "./modules/item-comment/item-comment.router";
import { TagRouter } from "./modules/tag/tag.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  collection: CollectionRouter,
  parse: ParseRouter,
  item: ItemRouter,
  field: FieldRouter,
  embedding: EmbeddingRouter,
  itemComment: ItemCommentRouter,
  tag: TagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
