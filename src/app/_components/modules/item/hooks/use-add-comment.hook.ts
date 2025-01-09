import { type Dispatch, type SetStateAction, useState } from "react";
import type { ItemStatus } from "@prisma/client";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../../../../../server/api/modules/item/types";

type Props = {
  item: ItemType;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useAddComment = (props: Props) => {
  const { item, setOpen } = props;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number[]>([item.rate ?? 0]);
  const [status, setStatus] = useState<ItemStatus>(item.status);
  const { mutateAsync } = api.itemComment.addItemComment.useMutation();

  const utils = api.useUtils();

  const submit = async () => {
    if (!title && !description) {
      toast.error(`Title or description is required!`);
      return;
    }
    const promise = mutateAsync(
      {
        itemId: item.id,
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
      loading: `Adding comment...`,
      success: `Comment added successfully!`,
      error: (error) => `Failed to add comment: ${error.message}`,
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
