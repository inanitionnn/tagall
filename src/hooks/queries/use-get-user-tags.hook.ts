"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { TagType } from "../../server/api/modules/tag/types/tag.type";
import { api } from "../../trpc/react";

type Props = {
  collectionsIds: string[];
};

export const useGetUserTags = (props: Props) => {
  const { collectionsIds } = props;

  const [tags, setTags] = useState<TagType[]>([]);

  const { data, isError, isSuccess } =
    api.tag.getUserTags.useQuery(collectionsIds);

  useEffect(() => {
    if (isSuccess) {
      setTags(data);
    }
  }, [isSuccess, data, setTags]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch tags");
    }
  }, [isError]);

  return {
    tags,
  };
};
