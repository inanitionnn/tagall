import { useState, useEffect, useCallback } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  ItemSmallType,
} from "../../../../../server/api/modules/item/types";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

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
  const [items, setItems] = useState<ItemSmallType[]>([]);

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
        setItems(data);
      } else {
        setItems((prev) => [...prev, ...data]);
      }
    }
  }, [data, limit, page]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (hasMore) {
      refetch();
    }
  }, [page, hasMore, refetch]);

  const resetPagination = useCallback(() => {
    setPage(1);
    setHasMore(true);
  }, []);

  return {
    items,
    setPage,
    hasMore,
    isLoading,
    resetPagination,
  };
};
