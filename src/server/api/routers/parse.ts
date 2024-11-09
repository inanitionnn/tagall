import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getImdbDetailsByUrl, searchImdb } from "~/server/services";

export const parseRouter = createTRPCRouter({
  searchImdb: protectedProcedure.input(z.string()).query(async ({ input }) => {
    if (input.length < 2) {
      return [];
    }
    return searchImdb(input);
  }),

  getImdbDetailsByUrl: protectedProcedure
    .input(z.string().url())
    .query(async ({ input }) => {
      return getImdbDetailsByUrl(input);
    }),
});
