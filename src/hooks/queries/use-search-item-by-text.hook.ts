"use client";

import { useState, useEffect } from "react";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../../server/api/modules/item/types";

type Props = {
  searchText: string;
};

export const useSearchItemByText = (props: Props) => {
  const { searchText } = props;

  const [items, setItems] = useState<ItemType[]>([]);

  const { data, isError, isFetched, isLoading, refetch } =
    api.item.searchItemByText.useQuery(searchText.trim(), {
      enabled: false,
    });

  const search = () => {
    if (searchText.trim().length > 0) {
      refetch();
    }
  };

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to search items");
    }
  }, [isError]);

  return {
    items,
    search,
    isFetched,
    isLoading,
    isError,
  };
};
