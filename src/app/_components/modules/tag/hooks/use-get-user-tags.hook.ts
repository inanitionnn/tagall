import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { TagType } from "../../../../../server/api/modules/tag/types/tag.type";

type Props = {
  collectionsIds: string[];
};

export const useGetUserTags = (props: Props) => {
  const { collectionsIds } = props;
  const { data, isError, isSuccess, isLoading, refetch } =
    api.tag.getUserTags.useQuery(collectionsIds);

  const [tags, setTags] = useState<TagType[]>([]);

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
    isLoading,
    refetch,
  };
};
