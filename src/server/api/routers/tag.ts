import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
        tagCategoryId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({
        data: {
          name: input.name,
          tagCategory: { connect: { id: input.tagCategoryId } },
        },
      });
    }),
});
