"use client";

import { useState, useEffect, useRef } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  ItemType,
} from "../../server/api/modules/item/types";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import { useDebounce } from "../utils/use-debounce.hook";
import { DEFAULT_HOME_LIMIT } from "../../constants";

type Props = {
  collectionsIds: string[];
  sorting: GetUserItemsSortType;
  filtering: GetUserItemsFilterType;
  searchQuery: string;
};

export const useGetPublicUserItems = (props: Props) => {
  const { collectionsIds, sorting, filtering, searchQuery } = props;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<ItemType[]>([]);
  
  const loadedItemIdsRef = useRef<Set<string>>(new Set());
  const lastProcessedKeyRef = useRef<string>("");

  const debouncedProps = useDebounce({
    collectionsIds,
    filtering,
    sorting,
    searchQuery: searchQuery.toLowerCase().trim(),
  });

  const { data, isLoading, error, dataUpdatedAt } =
    api.item.getPublicUserItems.useQuery({
      limit: DEFAULT_HOME_LIMIT,
      page,
      collectionsIds: debouncedProps.collectionsIds,
      sorting: debouncedProps.sorting,
      filtering: debouncedProps.filtering,
      search: debouncedProps.searchQuery,
    });

  useEffect(() => {
    if (data) {
      if (data.length > 0) {
        // Create a unique key including timestamp to ensure we only process each fetch once
        const sortingKey = `${debouncedProps.sorting.name}-${debouncedProps.sorting.type}`;
        const dataKey = `${page}-${sortingKey}-${dataUpdatedAt}-${data.map(item => item.id).join(',')}`;
        
        // Skip if we already processed this exact batch
        if (dataKey === lastProcessedKeyRef.current) {
          return;
        }
        
        lastProcessedKeyRef.current = dataKey;
        
        if (data.length < DEFAULT_HOME_LIMIT) {
          setHasMore(false);
        }
        
        const newItems = data.filter((item) => !loadedItemIdsRef.current.has(item.id));
        
        if (newItems.length > 0) {
          newItems.forEach((item) => loadedItemIdsRef.current.add(item.id));
          
          if (page === 1) {
            setItems(newItems);
          } else {
            setItems((prev) => [...prev, ...newItems]);
          }
        }
      } else {
        // Empty data array
        setHasMore(false);
        if (page === 1) {
          setItems([]);
        }
      }
    }
  }, [data, page, debouncedProps.sorting, dataUpdatedAt]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setItems([]);
    loadedItemIdsRef.current = new Set();
    lastProcessedKeyRef.current = "";
  }, [debouncedProps]);

  return {
    items: items ?? [],
    setPage,
    hasMore,
    isLoading,
  };
};
