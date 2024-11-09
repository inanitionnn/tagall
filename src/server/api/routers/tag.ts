import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(64),
        priority: z.number().min(0).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.create({
        data: {
          name: input.name,
          priority: input.priority,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(64),
        priority: z.number().min(0).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.update({
        where: { id: input.id },
        data: {
          name: input.name,
          priority: input.priority,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.tag.delete({ where: { id: input } });
    }),
});
