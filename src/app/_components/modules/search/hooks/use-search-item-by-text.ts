import { useEffect, useState } from "react";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import type { ItemSmallType } from "../../../../../server/api/modules/item/types";

export const useSearchItemByText = () => {
  const { mutate, data, error, isPending } =
    api.item.searchItemByText.useMutation();

  const [items, setItems] = useState<ItemSmallType[]>([]);

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
