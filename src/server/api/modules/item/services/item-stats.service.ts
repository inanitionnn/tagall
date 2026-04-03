import { ItemStatus, Prisma } from "@prisma/client";
import type { ContextType } from "../../../../types";
import type {
  ItemsDateStatsType,
  ItemsRateStatsType,
  ItemsStatusStatsType,
} from "../types";
import { STATUS_VALUES } from "~/constants";

type DateStatsRow = { month: Date; created: bigint; updated: bigint };

export async function getUserItemsDateStats(props: {
  ctx: ContextType;
  collectionsIds: string[] | undefined;
}): Promise<ItemsDateStatsType[]> {
  const { ctx, collectionsIds } = props;

  const userId = ctx.session.user.id;

  const monthNamesFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  const collectionJoin = collectionsIds?.length
    ? Prisma.sql`INNER JOIN "Item" i ON u."itemId" = i.id`
    : Prisma.empty;

  const collectionWhere = collectionsIds?.length
    ? Prisma.sql`AND i."collectionId" IN (${Prisma.join(collectionsIds)})`
    : Prisma.empty;

  const rows = await ctx.db.$queryRaw<DateStatsRow[]>`
    WITH months AS (
      SELECT generate_series(
        date_trunc('month', NOW() - INTERVAL '5 months'),
        date_trunc('month', NOW()),
        INTERVAL '1 month'
      ) AS month
    ),
    created_counts AS (
      SELECT date_trunc('month', u."createdAt") AS month, COUNT(*) AS count
      FROM "UserToItem" u
      ${collectionJoin}
      WHERE u."userId" = ${userId}
        AND u."createdAt" >= date_trunc('month', NOW() - INTERVAL '5 months')
        ${collectionWhere}
      GROUP BY 1
    ),
    updated_counts AS (
      SELECT date_trunc('month', u."updatedAt") AS month, COUNT(*) AS count
      FROM "UserToItem" u
      ${collectionJoin}
      WHERE u."userId" = ${userId}
        AND u."updatedAt" >= date_trunc('month', NOW() - INTERVAL '5 months')
        ${collectionWhere}
      GROUP BY 1
    )
    SELECT
      m.month,
      COALESCE(c.count, 0)::int AS created,
      COALESCE(u.count, 0)::int AS updated
    FROM months m
    LEFT JOIN created_counts c ON c.month = m.month
    LEFT JOIN updated_counts u ON u.month = m.month
    ORDER BY m.month
  `;

  return rows.map((row) => ({
    month: monthNamesFormatter.format(row.month),
    created: Number(row.created),
    updated: Number(row.updated),
  }));
}

export async function getUserItemsStatusStats(props: {
  ctx: ContextType;
  collectionsIds: string[] | undefined;
}): Promise<ItemsStatusStatsType[]> {
  const { ctx, collectionsIds } = props;

  const rows = await ctx.db.userToItem.groupBy({
    by: ["status"],
    _count: { _all: true },
    where: {
      userId: ctx.session.user.id,
      ...(collectionsIds?.length && {
        item: { collectionId: { in: collectionsIds } },
      }),
    },
  });

  const countMap = new Map(rows.map((r) => [r.status, r._count._all]));

  return Object.values(ItemStatus)
    .map((status) => ({ status, count: countMap.get(status) ?? 0 }))
    .sort(
      (a, b) =>
        STATUS_VALUES.indexOf(a.status) - STATUS_VALUES.indexOf(b.status),
    );
}
export async function getUserItemsRateStats(props: {
  ctx: ContextType;
  collectionsIds: string[] | undefined;
}): Promise<ItemsRateStatsType[]> {
  const { ctx, collectionsIds } = props;

  const rows = await ctx.db.userToItem.groupBy({
    by: ["rate"],
    _count: { _all: true },
    where: {
      userId: ctx.session.user.id,
      ...(collectionsIds?.length && {
        item: { collectionId: { in: collectionsIds } },
      }),
    },
  });

  const countMap = new Map(rows.map((r) => [r.rate ?? 0, r._count._all]));

  const allRates = [0, ...Array.from({ length: 10 }, (_, i) => i + 1)];
  return allRates
    .map((rate) => ({ rate, count: countMap.get(rate) ?? 0 }))
    .sort((a, b) => a.rate - b.rate);
}
