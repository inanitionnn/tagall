"use client";

import { useEffect } from "react";
import type {
  GetRandomUserItemsInputType,
  ItemType,
} from "../../server/api/modules/item/types";
import { api } from "../../trpc/react";
import { toast } from "sonner";

export const useGetPublicRandomUserItems = (
  input: GetRandomUserItemsInputType,
) => {
  const { data, isLoading, error, refetch } =
    api.item.getPublicRandomUserItems.useQuery(input);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return {
    items: (data as ItemType[]) || [],
    isLoading,
    refetch,
  };
};
