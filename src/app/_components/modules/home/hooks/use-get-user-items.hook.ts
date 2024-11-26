import { useState, useEffect } from "react";
import {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  ItemType,
} from "../../../../../server/api/modules/item/types";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type Props = {
  limit: number;
  currentCollectionsIds: string[];
  sorting: GetUserItemsSortType;
  filtering: GetUserItemsFilterType;
};
export const useGetUserItems = (props: Props) => {
  const { limit = 10, currentCollectionsIds, sorting, filtering } = props;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<ItemType[]>([]);

  const { data, isLoading, error, refetch } = api.item.getUserItems.useQuery({
    limit,
    page,
    collectionsIds: currentCollectionsIds,
    sorting,
    filtering,
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
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (hasMore) {
      refetch();
    }
  }, [page]);

  const resetPagination = () => {
    setPage(1);
    setHasMore(true);
  };

  return {
    items,
    setPage,
    hasMore,
    isLoading,
    resetPagination,
  };
};
