import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const collectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.collection.findMany({
      orderBy: [{ name: "desc" }],
    });
  }),
});
