import { type Dispatch, type SetStateAction, useState } from "react";
import type { ItemStatus } from "@prisma/client";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../../../../../server/api/modules/item/types";

type Props = {
  item: ItemType;
  setOpenStatus: Dispatch<SetStateAction<boolean>>;
  setOpenRating: Dispatch<SetStateAction<boolean>>;
};

export const useUpdateItem = (props: Props) => {
  const { item, setOpenRating, setOpenStatus } = props;
  const [rating, setRating] = useState<number[]>([item.rate ?? 0]);
  const [status, setStatus] = useState<ItemStatus>(item.status);
  const { mutateAsync } = api.item.updateItem.useMutation();

  const submit = async () => {
    const promise = mutateAsync({
      rate: rating[0] ?? 0,
      status,
      id: item.id,
    });

    setOpenRating(false);
    setOpenStatus(false);

    item.rate = rating[0] ?? 0;
    item.status = status;

    toast.promise(promise, {
      loading: `Updating ${item.title}...`,
      success: `${item.title} updated successfully!`,
      error: (error) => `Failed to update ${item.title}: ${error.message}`,
    });
  };

  return {
    rating,
    setRating,
    status,
    setStatus,
    submit,
  };
};
