import { useEffect, useState } from "react";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type Props = {
  currentCollectionsIds: string[];
};

export const useGetFilterFields = (props: Props) => {
  const { currentCollectionsIds } = props;

  const [filterFieldGroups, setFilterFieldGroups] = useState<
    {
      fields: {
        value: string;
        id: string;
      }[];
      id: string;
      name: string;
      priority: number;
    }[]
  >([]);

  const { data, isLoading, error, refetch } =
    api.field.getFilterFields.useQuery();

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
  }, [currentCollectionsIds]);

  return {
    isLoading,
    filterFieldGroups,
  };
};
