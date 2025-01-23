import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "../trpc/react";
import type { ItemsStatsType } from "../server/api/modules/item/types";

type Props = {
  collectionsIds: string[];
};

export const useUserItemsStats = (props: Props) => {
  const { collectionsIds } = props;

  const [stats, setStats] = useState<ItemsStatsType | null>(null);

  const { data, error } = api.item.getUserItemsStats.useQuery(collectionsIds);

  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return {
    stats,
  };
};
