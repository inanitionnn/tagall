"use client";

import { useEffect, useState } from "react";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../../server/api/modules/item/types";

export const useSearchItemByText = () => {
  const [items, setItems] = useState<ItemType[]>([]);

  const { mutate, data, error, isPending } =
    api.item.searchItemByText.useMutation();

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
    mutate,
    isPending,
  };
};
