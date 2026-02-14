"use client";

import { useEffect } from "react";
import type {
  GetAllUserItemsInputType,
  TierItemType,
} from "../../server/api/modules/item/types";
import { api } from "../../trpc/react";
import { toast } from "sonner";

export const useGetPublicAllUserItems = (input: GetAllUserItemsInputType) => {
  const { data, isLoading, error } = api.item.getPublicAllUserItems.useQuery(input);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return {
    tierItems: (data as TierItemType[]) || [],
    isLoading,
  };
};
