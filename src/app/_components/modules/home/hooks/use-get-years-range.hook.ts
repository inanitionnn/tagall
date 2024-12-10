import { useEffect, useState } from "react";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type Props = {
  currentCollectionsIds: string[];
};

export const useYearsRange = (props: Props) => {
  const { currentCollectionsIds } = props;

  const [yearsRange, setYearsRange] = useState<{
    minYear: number;
    maxYear: number;
  }>({ minYear: 0, maxYear: 0 });

  const { data, error, refetch } = api.item.getYearsRange.useQuery(
    currentCollectionsIds,
  );

  useEffect(() => {
    if (data) {
      console.log(data);
      setYearsRange({
        minYear: data.minYear ?? 0,
        maxYear: data.maxYear ?? 0,
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
  useEffect(() => {
    if (yearsRange) {
      console.log(yearsRange);
    }
  }, [yearsRange]);

  useEffect(() => {
    refetch();
  }, [currentCollectionsIds, refetch]);

  return {
    yearsRange,
  };
};
