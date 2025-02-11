import type { ContextType } from "../../../../types";
import type { CollectionType } from "../types";

export const GetAll = async (props: {
  ctx: ContextType;
}): Promise<CollectionType[]> => {
  const { ctx } = props;

  const collections = await ctx.db.collection.findMany({
    orderBy: [{ priority: "asc" }],
  });

  return collections;
};

export const GetUserCollections = async (props: {
  ctx: ContextType;
}): Promise<CollectionType[]> => {
  const { ctx } = props;

  const collections = await ctx.db.collection.findMany({
    where: {
      items: {
        some: {
          userToItems: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      },
    },
    orderBy: [{ priority: "asc" }],
  });

  return collections;
};
