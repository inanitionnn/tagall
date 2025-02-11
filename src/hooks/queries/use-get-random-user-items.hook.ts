"use client";

import { useState, useEffect } from "react";
import type {
  GetUserItemsFilterType,
  ItemSmallType,
} from "../../server/api/modules/item/types";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import { useDebounce } from "../utils/use-debounce.hook";

type Props = {
  limit: number;
  collectionsIds: string[];
  filtering: GetUserItemsFilterType;
};
export const useGetRandomUserItems = (props: Props) => {
  const { limit, collectionsIds, filtering } = props;

  const [items, setItems] = useState<ItemSmallType[]>([]);

  const debouncedProps = useDebounce({
    collectionsIds,
    filtering,
    limit,
  });

  const { data, isFetching, error, refetch } =
    api.item.getRandomUserItems.useQuery({
      limit: debouncedProps.limit,
      collectionsIds: debouncedProps.collectionsIds,
      filtering: debouncedProps.filtering,
    });

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return {
    items,
    isLoading: isFetching,
    refetch,
  };
};
