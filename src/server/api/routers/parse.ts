import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { searchImdb } from "~/server/services";

export const parseRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        collectionId: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      const collection = await ctx.db.collection.findUnique({
        where: { id: input.collectionId },
      });
      console.log("collection!:", collection);
      if (!collection) {
        throw new Error("Collection not found");
      }
      console.log(collection);
      switch (collection.name) {
        case "Film":
          return searchImdb(input.query, "film");
        case "Serie":
          return searchImdb(input.query, "series");
        default:
          throw new Error("Invalid collection name");
      }
    }),
});
