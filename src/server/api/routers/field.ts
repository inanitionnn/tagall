import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fieldRouter = createTRPCRouter({
  getSortingFieldGroups: protectedProcedure
    .input(z.array(z.string().cuid()).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.fieldGroup.findMany({
        where: {
          isSorting: true,
          ...(input &&
            input.length && {
              collections: {
                some: {
                  id: {
                    in: input,
                  },
                },
              },
            }),
        },
        select: {
          id: true,
          name: true,
          priority: true,
        },
        orderBy: {
          priority: "asc",
        },
      });
    }),

  getFilteringFields: protectedProcedure
    .input(z.array(z.string().cuid()).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.fieldGroup.findMany({
        where: {
          isFiltering: true,
          ...(input &&
            input.length && {
              collections: {
                some: {
                  id: {
                    in: input,
                  },
                },
              },
            }),
        },
        select: {
          id: true,
          name: true,
          fields: {
            ...(input &&
              input.length && {
                where: {
                  items: {
                    some: {
                      collectionId: {
                        in: input,
                      },
                    },
                  },
                },
              }),
            select: {
              id: true,
              value: true,
            },
          },
          isNumber: true,
          priority: true,
        },
        orderBy: {
          priority: "asc",
        },
      });
    }),
});
