import { type Dispatch, type SetStateAction, useState } from "react";
import type { SearchResultType } from "../../../../../server/api/modules/parse/types";
import { ItemStatus } from "@prisma/client";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type Props = {
  currentItem: SearchResultType | null;
  currentCollectionId: string;
  setCurrentItem: Dispatch<SetStateAction<SearchResultType | null>>;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
};

export const useAddItemToCollection = (props: Props) => {
  const { currentCollectionId, currentItem, setCurrentItem, setSearchResults } =
    props;

  const [commentTitle, setCommentTitle] = useState<string>("");
  const [commentDescription, setCommentDescription] = useState<string>("");
  const [rating, setRating] = useState<number[]>([0]);
  const [status, setStatus] = useState<ItemStatus>(ItemStatus.NOTSTARTED);
  const { mutateAsync } = api.item.addToCollection.useMutation();

  const submit = async () => {
    if (!currentItem) return;

    if (currentItem.inCollection) {
      toast.error(`${currentItem.title} is already in your collection!`);
      setCurrentItem(null);
      return;
    }

    const promise = mutateAsync({
      collectionId: currentCollectionId,
      rate: rating[0] ?? 0,
      status,
      id: currentItem.parsedId,
      comment: {
        title: commentTitle,
        description: commentDescription,
      },
    });

    setCurrentItem(null);
    setSearchResults((prev) =>
      prev.map((searchResult) => {
        const isCurrentItem = searchResult.parsedId === currentItem?.parsedId;
        if (isCurrentItem) {
          return {
            ...searchResult,
            inCollection: true,
          };
        }
        return searchResult;
      }),
    );

    toast.promise(promise, {
      loading: `Adding ${currentItem.title}...`,
      success: `${currentItem.title} added successfully!`,
      error: (error) => `Failed to add ${currentItem.title}: ${error.message}`,
    });
  };

  return {
    rating,
    setRating,
    status,
    setStatus,
    commentTitle,
    setCommentTitle,
    commentDescription,
    setCommentDescription,
    submit,
  };
};
