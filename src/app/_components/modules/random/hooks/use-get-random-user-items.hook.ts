import { useState, useEffect } from "react";
import type {
  GetUserItemsFilterType,
  ItemSmallType,
} from "../../../../../server/api/modules/item/types";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type Props = {
  limit: number;
  tagsIds: string[];
  collectionsIds: string[];
  filtering: GetUserItemsFilterType;
};
export const useGetRandomUserItems = (props: Props) => {
  const { limit = 10, collectionsIds, tagsIds, filtering } = props;
  const [items, setItems] = useState<ItemSmallType[]>([]);

  const { data, isFetching, error, refetch } =
    api.item.getRandomUserItems.useQuery({
      limit,
      collectionsIds,
      filtering,
      tagsIds,
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
