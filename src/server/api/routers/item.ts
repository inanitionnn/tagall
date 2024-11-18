import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { createImdbItem, getImdbDetailsById } from "../../services";
import { ItemStatus } from "@prisma/client";

export const itemRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z
        .object({
          page: z.number().int().min(1).optional(),
          limit: z.number().int().max(100).min(1).optional(),
          query: z
            .object({
              collectionId: z.string().cuid().optional(),
            })
            .optional(),
          orderBy: z.object({}).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      if (!input) {
        const items = await ctx.db.item.findMany({
          include: {
            fields: {
              include: {
                fieldGroup: true,
              },
            },
          },
        });

        return items.map((item) => {
          const groupedFields: {
            [key: string]: { name: string; fields: { value: string }[] };
          } = {};

          item.fields.forEach((field) => {
            const groupId = field.fieldGroup.id;
            const groupName = field.fieldGroup.name;

            if (!groupedFields[groupId]) {
              groupedFields[groupId] = {
                name: groupName,
                fields: [],
              };
            }

            groupedFields[groupId].fields.push({ value: field.value });
          });

          return {
            id: item.id,
            name: item.name,
            image: item.image,

            fieldGroups: Object.values(groupedFields),
          };
        });
      }
      const { orderBy, query, limit = 20, page = 1 } = input;
      return ctx.db.item.findMany({
        where: {
          collectionId: query?.collectionId,
        },
        orderBy: {},
        take: limit,
        skip: (page - 1) * limit,
      });
    }),

  addToUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        collectionId: z.string().cuid(),
        rate: z.number().int().min(0).max(10),
        status: z.nativeEnum(ItemStatus),
        tags: z.array(z.string().cuid()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.db.collection.findUnique({
        where: { id: input.collectionId },
      });
      if (!collection) {
        throw new Error("Collection not found");
      }
      let item;
      switch (collection.name) {
        case "Serie":
        case "Film":
          item = await createImdbItem({
            ctx,
            id: input.id,
            collectionId: collection.id,
          });
          break;
        default:
          throw new Error("Invalid collection name");
      }
      if (!item) {
        throw new Error("Something went wrong! Item not found!");
      }

      await ctx.db.userToItem.create({
        data: {
          userId: ctx.session.user.id,
          itemId: item.id,
          rate: input.rate ? input.rate : null,
          status: input.status,
          // tags: {
          //   connect: input.tags?.map((tag) => ({ id: tag })),
          // },
        },
      });
    }),
});
