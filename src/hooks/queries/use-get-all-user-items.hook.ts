"use client";

import { useState, useEffect } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  TierItemType,
} from "../../server/api/modules/item/types";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import { useDebounce } from "../utils/use-debounce.hook";

type TierItemsMap = Map<number, TierItemType[]>;

type Props = {
  collectionsIds: string[];
  sorting: GetUserItemsSortType;
  filtering: GetUserItemsFilterType;
  searchQuery: string;
};

export const useGetAllUserItems = (props: Props) => {
  const { collectionsIds, sorting, filtering, searchQuery } = props;

  const [tierItemsMap, setTierItemsMap] = useState<TierItemsMap>(new Map());

  const debouncedProps = useDebounce({
    collectionsIds,
    filtering,
    sorting,
    searchQuery: searchQuery.toLowerCase().trim(),
  });

  const { data, isLoading, error } = api.item.getAllUserItems.useQuery(
    {
      collectionsIds: debouncedProps.collectionsIds,
      sorting: debouncedProps.sorting,
      filtering: debouncedProps.filtering,
      search: debouncedProps.searchQuery,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    }
  );

  useEffect(() => {
    if (data) {
      const newMap = new Map<number, TierItemType[]>();
      
      // Initialize all tiers (0-10)
      for (let i = 0; i <= 10; i++) {
        newMap.set(i, []);
      }
      
      // Group items by rate
      data.forEach((item) => {
        const rate = item.rate ?? 0;
        const items = newMap.get(rate) ?? [];
        items.push(item);
        newMap.set(rate, items);
      });
      
      setTierItemsMap(newMap);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return {
    tierItemsMap,
    setTierItemsMap,
    isLoading,
  };
};
