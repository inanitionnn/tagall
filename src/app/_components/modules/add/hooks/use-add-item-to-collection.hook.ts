import { type Dispatch, type SetStateAction } from "react";
import type { SearchResultType } from "../../../../../server/api/modules/parse/types";
import { ItemStatus } from "@prisma/client";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  commentTitle: z.string().min(1).max(255).nullable().optional(),
  commentDescription: z.string().min(1).max(1000).nullable().optional(),
  rate: z.number().int().min(0).max(10),
  status: z.nativeEnum(ItemStatus),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  currentItem: SearchResultType | null;
  currentCollectionId: string;
  setCurrentItem: Dispatch<SetStateAction<SearchResultType | null>>;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
};

export const useAddItemToCollection = (props: Props) => {
  const { currentCollectionId, currentItem, setCurrentItem, setSearchResults } =
    props;

  const { mutateAsync } = api.item.addToCollection.useMutation();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      commentTitle: null,
      commentDescription: null,
      rate: 0,
      status: ItemStatus.NOTSTARTED,
    },
  });

  const submit = async (data: formDataType) => {
    if (!currentItem) return;

    if (currentItem.id) {
      toast.error(`${currentItem.title} is already in your collection!`);
      setCurrentItem(null);
      return;
    }
    const { commentTitle, commentDescription, rate, status } = data;
    const formData = {
      status,
      rate,
      collectionId: currentCollectionId,
      parsedId: currentItem.parsedId,
      ...((commentTitle || commentDescription) && {
        comment: {
          title: commentTitle,
          description: commentDescription,
        },
      }),
    };

    const promise = mutateAsync(formData);

    setCurrentItem(null);
    setSearchResults((prev) =>
      prev.filter(
        (searchResult) => searchResult.parsedId !== currentItem?.parsedId,
      ),
    );

    toast.promise(promise, {
      loading: `Adding ${currentItem.title}...`,
      success: `${currentItem.title} added successfully!`,
      error: (error) => `Failed to add ${currentItem.title}: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
