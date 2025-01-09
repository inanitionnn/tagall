import { type Dispatch, type SetStateAction, useState } from "react";
import type { ItemStatus } from "@prisma/client";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../../../../../server/api/modules/item/types";

type Props = {
  comment: NonNullable<ItemType["comments"]>[number];
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useUpdateComment = (props: Props) => {
  const { comment, setOpen } = props;
  const [title, setTitle] = useState<string>(comment.title ?? "");
  const [description, setDescription] = useState<string>(
    comment.description ?? "",
  );
  const [rating, setRating] = useState<number[]>([comment.rate ?? 0]);
  const [status, setStatus] = useState<ItemStatus>(comment.status);
  const { mutateAsync } = api.itemComment.updateItemComment.useMutation();

  const utils = api.useUtils();

  const submit = async () => {
    if (!title && !description) {
      toast.error(`Title or description is required!`);
      return;
    }
    const promise = mutateAsync(
      {
        id: comment.id,
        title: title || undefined,
        description: description || undefined,
        rate: rating[0] ?? 0,
        status,
      },
      {
        onSuccess: () => {
          utils.item.invalidate();
        },
      },
    );

    setOpen(false);

    toast.promise(promise, {
      loading: `Updating comment...`,
      success: `Comment updated successfully!`,
      error: (error) => `Failed to update comment: ${error.message}`,
    });
  };

  return {
    rating,
    setRating,
    status,
    setStatus,
    title,
    setTitle,
    description,
    setDescription,
    submit,
  };
};
