import { Dispatch, SetStateAction, useState } from "react";
import { SearchResultType } from "../../../../../server/api/modules/parse/types";
import { ItemStatus } from "@prisma/client";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type Props = {
  currentItem: SearchResultType | null;
  currentCollectionId: string;
  setCurrentItem: Dispatch<SetStateAction<SearchResultType | null>>;
};

export const useAddItemToUser = (props: Props) => {
  const { currentCollectionId, currentItem, setCurrentItem } = props;
  const [rating, setRating] = useState<number[]>([0]);
  const [status, setStatus] = useState<ItemStatus>(ItemStatus.NOTSTARTED);
  const { mutateAsync } = api.item.addToUser.useMutation();

  const submit = async () => {
    if (!currentItem) return;

    const match = currentItem.link?.match(/\/title\/(tt\d+)/);
    const id = match ? match[1] : null;

    if (!id) {
      toast.error("Invalid item id");
      return;
    }

    const promise = mutateAsync({
      collectionId: currentCollectionId,
      rate: rating[0] ?? 0,
      status,
      id,
    });

    setCurrentItem(null);

    toast.promise(promise, {
      loading: "Adding item...",
      success: "Item added successfully!",
      error: (error) => `Failed to add item: ${error.message}`,
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
