"use client";

import { useEffect, useState } from "react";
import { api } from "../../trpc/react";
import { toast } from "sonner";

type Props = {
  collectionsIds: string[];
};

export const useYearsRange = (props: Props) => {
  const { collectionsIds } = props;

  const [yearsRange, setYearsRange] = useState<{
    minYear: number;
    maxYear: number;
  }>({ minYear: 0, maxYear: 0 });

  const { data, error, refetch } =
    api.item.getYearsRange.useQuery(collectionsIds);

  useEffect(() => {
    if (data) {
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
    refetch();
  }, [collectionsIds, refetch]);

  return {
    yearsRange,
  };
};
