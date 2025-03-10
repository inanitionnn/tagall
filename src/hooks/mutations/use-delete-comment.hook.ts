"use client";

import { type Dispatch, type SetStateAction } from "react";

import { api } from "../../trpc/react";
import { toast } from "sonner";
import type { CommentType } from "../../server/api/modules/item-comment/types";

type Props = {
  comment: CommentType;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useDeleteComment = (props: Props) => {
  const { comment, setOpen } = props;

  const { mutateAsync } = api.itemComment.deleteItemComment.useMutation();

  const utils = api.useUtils();

  const submit = async () => {
    const promise = mutateAsync(comment.id, {
      onSuccess: () => {
        utils.itemComment.invalidate();
      },
    });

    setOpen(false);

    toast.promise(promise, {
      loading: `Deleting comment...`,
      success: `Comment deleted successfully!`,
      error: (error) => `Failed to delete comment: ${error.message}`,
    });
  };

  return {
    submit,
  };
};
