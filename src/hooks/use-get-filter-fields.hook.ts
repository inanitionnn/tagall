import { useEffect, useState } from "react";
import { api } from "../trpc/react";
import { toast } from "sonner";
import type { FilterFieldsType } from "../server/api/modules/field/types";

type Props = {
  collectionsIds: string[];
};

export const useGetFilterFields = (props: Props) => {
  const { collectionsIds } = props;

  const [filterFieldGroups, setFilterFieldGroups] = useState<
    FilterFieldsType[]
  >([]);

  const { data, isLoading, error, refetch } =
    api.field.getFilterFields.useQuery(collectionsIds);

  useEffect(() => {
    if (data) {
      setFilterFieldGroups(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    refetch();
  }, [collectionsIds, refetch]);

  return {
    isLoading,
    filterFieldGroups,
  };
};
