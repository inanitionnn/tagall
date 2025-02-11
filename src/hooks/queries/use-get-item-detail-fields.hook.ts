"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "../../trpc/react";

type Props = {
  itemId: string;
};

export const useGetItemDetailFields = (props: Props) => {
  const { itemId } = props;

  const [fieldData, setFieldData] = useState<Record<string, any>>({});

  const { data, isError, isLoading, isSuccess } =
    api.field.getItemDetailFields.useQuery(itemId);

  useEffect(() => {
    if (isSuccess) {
      setFieldData(data);
    }
  }, [isSuccess, data, setFieldData]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch details");
    }
  }, [isError]);

  return {
    fieldData,
    isLoading,
  };
};
