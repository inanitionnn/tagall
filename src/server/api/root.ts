import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tagRouter } from "./routers/tag";
import { collectionRouter } from "./routers/collection";
import { parseRouter } from "./routers/parse";
import { itemRouter } from "./routers/item";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tag: tagRouter,
  collection: collectionRouter,
  parse: parseRouter,
  item: itemRouter,
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
