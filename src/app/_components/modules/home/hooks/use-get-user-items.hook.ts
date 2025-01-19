import { useState, useEffect, useCallback } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  ItemSmallType,
} from "../../../../../server/api/modules/item/types";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type GroupedItems = {
  groupBy: string;
  items: ItemSmallType[];
};

const capitalize = (val: string | number | null) => {
  if (!val) return "#";
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

const isLetter = (char: string): boolean => {
  return /^[a-zA-Zа-яА-Я]$/.test(char);
};

const groupByKey = (item: ItemSmallType, sorting: GetUserItemsSortType) => {
  let key: string | number | null = null;
  switch (sorting.name) {
    case "year": {
      key = item.year;
      break;
    }
    case "rate": {
      key = item.rate;
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
      key = item.status;
      break;
    }
    default: {
      sorting.name satisfies never;
      throw new Error(`Unhandled sorting name.`);
    }
  }
  return capitalize(key);
};

const groupItems = (
  items: ItemSmallType[],
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

type Props = {
  limit: number;
  tagsIds: string[];
  collectionsIds: string[];
  sorting: GetUserItemsSortType;
  filtering: GetUserItemsFilterType;
  searchQuery: string;
};

export const useGetUserItems = (props: Props) => {
  const {
    limit = 10,
    collectionsIds,
    sorting,
    tagsIds,
    filtering,
    searchQuery,
  } = props;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [groupedItems, setGroupedItems] = useState<GroupedItems[]>([]);

  const { data, isLoading, error, refetch } = api.item.getUserItems.useQuery({
    limit,
    page,
    collectionsIds,
    sorting,
    filtering,
    search: searchQuery,
    tagsIds,
  });

  useEffect(() => {
    if (data) {
      if (data.length < limit) {
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

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    groupedItems,
    setPage,
    hasMore,
    isLoading,
    resetPagination,
  };
};
