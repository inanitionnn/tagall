import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.tagCategory.findMany({
      include: {
        tags: {
          orderBy: { name: "asc" },
        },
      },
      orderBy: [{ isAuto: "asc" }, { priority: "desc" }, { name: "desc" }],
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
        icon: z.string().max(64).nullable().optional(),
        isAuto: z.boolean(),
        priority: z.number().min(0).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tagCategory.create({
        data: {
          name: input.name,
          icon: input.icon,
          isAuto: input.isAuto,
          priority: input.priority,
        },
      });
    }),
});
