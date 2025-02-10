import { useState, useEffect } from "react";
import type {
  GetUserItemsFilterType,
  ItemSmallType,
} from "../../server/api/modules/item/types";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import { useDebounce } from "../utils/use-debounce.hook";

type Props = {
  limit?: number;
  debounce?: number;
  tagsIds: string[];
  collectionsIds: string[];
  filtering: GetUserItemsFilterType;
};
export const useGetRandomUserItems = (props: Props) => {
  const { limit, debounce, collectionsIds, tagsIds, filtering } = props;

  const LIMIT = limit || 10;
  const DEBOUNCE = debounce || 400;

  const [items, setItems] = useState<ItemSmallType[]>([]);

  const debounceObj = useDebounce(
    {
      collectionsIds,
      filtering,
      tagsIds,
      limit,
    },
    DEBOUNCE,
  );

  const { data, isFetching, error, refetch } =
    api.item.getRandomUserItems.useQuery({
      limit: LIMIT,
      collectionsIds: debounceObj.collectionsIds,
      filtering: debounceObj.filtering,
      tagsIds: debounceObj.tagsIds,
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
