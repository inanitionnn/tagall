import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { collectionRouter } from "./modules/collection";
import { fieldRouter } from "./modules/field";
import { parseRouter } from "./modules/parse";
import { ItemRouter } from "./modules/item";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  parse: parseRouter,
  item: ItemRouter,
  field: fieldRouter,
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
