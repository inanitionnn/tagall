"use client";

import { useEffect } from "react";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import { useDebounce } from "../utils/use-debounce.hook";

export const useGetPublicUserItemsStats = (collectionsIds: string[]) => {
  const debouncedCollectionsIds = useDebounce(collectionsIds);

  const { data, isLoading, error } =
    api.item.getPublicUserItemsStats.useQuery(debouncedCollectionsIds);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return {
    stats: data,
    isLoading,
  };
};
