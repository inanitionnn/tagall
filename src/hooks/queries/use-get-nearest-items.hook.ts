"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "../../trpc/react";
import type { ItemType } from "../../server/api/modules/item/types";

type Props = {
  itemId: string;
  limit?: number;
};

export const useGetNearestItems = (props: Props) => {
  const { itemId, limit } = props;

  const [items, setItems] = useState<ItemType[]>([]);

  const { data, isError, isLoading, isSuccess } =
    api.item.getNearestItems.useQuery({
      itemId,
      limit,
    });

  useEffect(() => {
    if (isSuccess) {
      setItems(data);
    }
  }, [isSuccess, data, setItems]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch nearest items");
    }
  }, [isError]);

  return {
    items,
    isLoading,
  };
};
