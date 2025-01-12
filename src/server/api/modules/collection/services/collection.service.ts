import { getOrSetCache } from "../../../../../lib/redis";
import type { ContextType } from "../../../../types";
import type { CollectionType } from "../types";

export const GetAll = async (props: {
  ctx: ContextType;
}): Promise<CollectionType[]> => {
  const { ctx } = props;
  const redisKey = `collection:GetAll`;
  const promise = ctx.db.collection.findMany({
    orderBy: [{ priority: "asc" }],
  });

  return getOrSetCache<CollectionType[]>(redisKey, promise);
};

export const GetUserCollections = async (props: {
  ctx: ContextType;
}): Promise<CollectionType[]> => {
  const { ctx } = props;

  const redisKey = `collection:GetUserCollections:${ctx.session.user.id}`;
  const promise = ctx.db.collection.findMany({
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

  return getOrSetCache<CollectionType[]>(redisKey, promise);
};
