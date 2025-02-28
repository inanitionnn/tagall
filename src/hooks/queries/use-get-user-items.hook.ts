"use client";

import { useState, useEffect } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  ItemType,
} from "../../server/api/modules/item/types";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import { useDebounce } from "../utils/use-debounce.hook";
import { capitalize, isLetter } from "../../lib";
import {
  DEFAULT_HOME_LIMIT,
  RATING_NAMES,
  STATUS_NAMES,
} from "../../constants";

type GroupedItems = {
  groupBy: string;
  items: ItemType[];
};

type Props = {
  collectionsIds: string[];
  sorting: GetUserItemsSortType;
  filtering: GetUserItemsFilterType;
  searchQuery: string;
};

export const useGetUserItems = (props: Props) => {
  const { collectionsIds, sorting, filtering, searchQuery } = props;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [groupedItems, setGroupedItems] = useState<GroupedItems[]>([]);

  const debouncedProps = useDebounce({
    collectionsIds,
    filtering,
    sorting,
    searchQuery: searchQuery.toLowerCase().trim(),
  });

  const { data, isLoading, error, refetch } = api.item.getUserItems.useQuery({
    limit: DEFAULT_HOME_LIMIT,
    page,
    collectionsIds: debouncedProps.collectionsIds,
    sorting: debouncedProps.sorting,
    filtering: debouncedProps.filtering,
    search: debouncedProps.searchQuery,
  });

  useEffect(() => {
    if (data) {
      if (data.length < DEFAULT_HOME_LIMIT) {
        setHasMore(false);
      }
      if (page === 1) {
        setGroupedItems(() => groupItems(data, [], sorting));
      } else {
        setGroupedItems((prev) => groupItems(data, prev, sorting));
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (hasMore) {
      refetch();
    }
  }, [page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [debouncedProps]);

  return {
    groupedItems,
    setPage,
    hasMore,
    isLoading,
  };
};

// #region Helper functions

const groupByKey = (item: ItemType, sorting: GetUserItemsSortType) => {
  let key: string | number | null = null;
  switch (sorting.name) {
    case "year": {
      key = item.year;
      break;
    }
    case "rate": {
      key = `${item.rate || 0} - ${RATING_NAMES[item.rate || 0]}`;
      break;
    }
    case "title": {
      const firstCharacter = item.title.charAt(0);
      if (isLetter(firstCharacter)) {
        key = firstCharacter;
      }
      break;
    }
    case "date": {
      const dateType = item.timeAgo.split(" ")[1]!;
      key = `${dateType} ago`;
      break;
    }
    case "status": {
      key = STATUS_NAMES[item.status];
      break;
    }
    default: {
      sorting.name satisfies never;
      throw new Error(`Unhandled sorting name.`);
    }
  }

  if (!key) return "#";

  return capitalize(key);
};

const groupItems = (
  items: ItemType[],
  prev: GroupedItems[],
  sorting: GetUserItemsSortType,
): GroupedItems[] => {
  if (!items.length) return [];

  const groupedArray: GroupedItems[] = [
    ...prev.map((group) => ({ ...group, items: [...group.items] })),
  ];
  if (!groupedArray.length) {
    groupedArray.push({
      groupBy: groupByKey(items[0]!, sorting),
      items: [],
    });
  }
  let currentKey = groupedArray[groupedArray.length - 1]!.groupBy;
  for (const item of items) {
    const key = groupByKey(item, sorting);
    if (currentKey === key) {
      groupedArray[groupedArray.length - 1]!.items.push(item);
    } else {
      currentKey = key;
      groupedArray.push({
        groupBy: key,
        items: [item],
      });
    }
  }

  return groupedArray;
};

// #endregion Helper functions
