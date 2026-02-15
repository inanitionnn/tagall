import type { api } from "../trpc/react";

type UtilsType = ReturnType<typeof api.useUtils>;

export interface InvalidateItemQueriesOptions {
  collectionsIds?: string[];
  itemId?: string;
  includeStats?: boolean;
}

/**
 * Selective invalidation helper for item-related queries
 * This function invalidates only affected queries instead of all item queries
 * 
 * @param utils - tRPC utils instance
 * @param options - Configuration for which queries to invalidate
 */
export async function invalidateItemQueries(
  utils: UtilsType,
  options: InvalidateItemQueriesOptions = {}
): Promise<void> {
  const { collectionsIds, itemId, includeStats } = options;

  // Invalidate specific item if provided
  if (itemId) {
    await utils.item.getUserItem.invalidate(itemId);
  }

  // Invalidate user items queries
  if (collectionsIds) {
    // Invalidate queries for specific collections
    await utils.item.getUserItems.invalidate();
    await utils.item.getAllUserItems.invalidate();
  } else {
    // No collections specified - invalidate all
    await utils.item.getUserItems.invalidate();
    await utils.item.getAllUserItems.invalidate();
  }

  // Invalidate stats if requested
  if (includeStats) {
    await utils.item.getUserItemsStats.invalidate();
  }

  // Always invalidate filters and years range since they depend on items
  await utils.item.getYearsRange.invalidate();
  await utils.field.getFilterFields.invalidate();
}
