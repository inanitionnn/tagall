"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "../../trpc/react";
import type { CommentType } from "../../server/api/modules/item-comment/types";

type Props = {
  itemId: string;
};

export const useGetUserItemComments = (props: Props) => {
  const { itemId } = props;

  const [comments, setComments] = useState<CommentType[]>([]);

  const { data, isError, isLoading, isSuccess } =
    api.itemComment.getUserItemComment.useQuery(itemId);

  useEffect(() => {
    if (isSuccess) {
      setComments(data);
    }
  }, [isSuccess, data, setComments]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch comments");
    }
  }, [isError]);

  return {
    comments,
    isLoading,
  };
};
