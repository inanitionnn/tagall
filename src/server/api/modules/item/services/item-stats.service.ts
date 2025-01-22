import { ItemStatus } from "@prisma/client";
import type { ContextType } from "../../../../types";
import type {
  ItemsDateStatsType,
  ItemsRateStatsType,
  ItemsStatusStatsType,
} from "../types";
import { getOrSetCache } from "../../../../../lib/redis";

export async function getUserItemsDateStats(props: {
  ctx: ContextType;
  collectionsIds: string[] | undefined;
}): Promise<ItemsDateStatsType[]> {
  const { ctx, collectionsIds } = props;

  const redisKey = `itemStats:getUserItemsDateStats:${ctx.session.user.id}:${JSON.stringify(collectionsIds)}`;

  const promise = new Promise<ItemsDateStatsType[]>((resolve) => {
    (async () => {
      const currentDate = new Date();

      const months = Array.from({ length: 6 })
        .map((_, i) => {
          const date = new Date(currentDate);
          date.setMonth(currentDate.getMonth() - i);
          return date;
        })
        .reverse();

      const monthNamesFormatter = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      });

      const statsPromises = months.map(async (date) => {
        const isoMonth = date.toISOString().slice(0, 7);

        const [created, updated] = await Promise.all([
          ctx.db.userToItem.count({
            where: {
              userId: ctx.session.user.id,
              createdAt: {
                gte: new Date(`${isoMonth}-01T00:00:00Z`),
                lt: new Date(
                  new Date(`${isoMonth}-01T00:00:00Z`).setMonth(
                    new Date(`${isoMonth}-01T00:00:00Z`).getMonth() + 1,
                  ),
                ),
              },

              ...(collectionsIds?.length && {
                item: {
                  collectionId: {
                    in: collectionsIds,
                  },
                },
              }),
            },
          }),

          ctx.db.userToItem.count({
            where: {
              userId: ctx.session.user.id,
              updatedAt: {
                gte: new Date(`${isoMonth}-01T00:00:00Z`),
                lt: new Date(
                  new Date(`${isoMonth}-01T00:00Z`).setMonth(
                    new Date(`${isoMonth}-01T00:00Z`).getMonth() + 1,
                  ),
                ),
              },

              ...(collectionsIds?.length && {
                item: {
                  collectionId: {
                    in: collectionsIds,
                  },
                },
              }),
            },
          }),
        ]);

        return {
          date,
          created,
          updated,
        };
      });

      const stats = (await Promise.all(statsPromises))
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((stat) => ({
          month: monthNamesFormatter.format(stat.date),
          created: stat.created,
          updated: stat.updated,
        }));

      return resolve(stats);
    })();
  });

  return getOrSetCache<ItemsDateStatsType[]>(redisKey, promise);
}

export async function getUserItemsStatusStats(props: {
  ctx: ContextType;
  collectionsIds: string[] | undefined;
}): Promise<ItemsStatusStatsType[]> {
  const { ctx, collectionsIds } = props;

  const redisKey = `itemStats:getUserItemsStatusStats:${ctx.session.user.id}:${JSON.stringify(collectionsIds)}`;

  const promise = new Promise<ItemsStatusStatsType[]>((resolve) => {
    (async () => {
      const statuses = Object.values(ItemStatus);
      const statusCounts = await Promise.all(
        statuses.map(async (status) => {
          const count = await ctx.db.userToItem.count({
            where: {
              userId: ctx.session.user.id,
              status,

              ...(collectionsIds?.length && {
                item: {
                  collectionId: {
                    in: collectionsIds,
                  },
                },
              }),
            },
          });
          return { status, count };
        }),
      );
      const priorityOrder = Object.values(ItemStatus);
      const stats = statusCounts.sort(
        (a, b) =>
          priorityOrder.indexOf(a.status) - priorityOrder.indexOf(b.status),
      );
      return resolve(stats);
    })();
  });

  return getOrSetCache<ItemsStatusStatsType[]>(redisKey, promise);
}
export async function getUserItemsRateStats(props: {
  ctx: ContextType;
  collectionsIds: string[] | undefined;
}): Promise<ItemsRateStatsType[]> {
  const { ctx, collectionsIds } = props;
  const redisKey = `itemStats:getUserItemsRateStats:${ctx.session.user.id}:${JSON.stringify(collectionsIds)}`;

  const promise = new Promise<ItemsRateStatsType[]>((resolve) => {
    (async () => {
      const rates = [
        null,
        ...Array.from({ length: 10 }, (_, index) => index + 1),
      ];
      const rateCounts = await Promise.all(
        rates.map(async (rate) => {
          const count = await ctx.db.userToItem.count({
            where: {
              userId: ctx.session.user.id,
              rate: rate,

              ...(collectionsIds?.length && {
                item: {
                  collectionId: {
                    in: collectionsIds,
                  },
                },
              }),
            },
          });
          return { rate: rate ?? 0, count };
        }),
      );

      const stats = rateCounts.sort((a, b) => a.rate - b.rate);
      return resolve(stats);
    })();
  });

  return getOrSetCache<ItemsRateStatsType[]>(redisKey, promise);
}
