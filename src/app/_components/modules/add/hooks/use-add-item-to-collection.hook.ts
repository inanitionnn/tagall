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
  tagsIds: z.array(z.string().cuid()),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  selectedItem: SearchResultType | null;
  selectedCollectionId: string;
  setSelectedItem: Dispatch<SetStateAction<SearchResultType | null>>;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
};

export const useAddItemToCollection = (props: Props) => {
  const {
    selectedCollectionId,
    selectedItem,
    setSelectedItem,
    setSearchResults,
  } = props;

  const { mutateAsync } = api.item.addToCollection.useMutation();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      commentTitle: null,
      commentDescription: null,
      rate: 0,
      status: ItemStatus.NOTSTARTED,
      tagsIds: [],
    },
  });

  const submit = async (data: formDataType) => {
    if (!selectedItem) return;

    if (selectedItem.id) {
      toast.error(`${selectedItem.title} is already in your collection!`);
      setSelectedItem(null);
      return;
    }
    const { commentTitle, commentDescription, rate, status, tagsIds } = data;
    const formData = {
      status,
      rate,
      collectionId: selectedCollectionId,
      tagsIds: tagsIds,
      parsedId: selectedItem.parsedId,
      ...((commentTitle || commentDescription) && {
        comment: {
          title: commentTitle,
          description: commentDescription,
        },
      }),
    };

    const promise = mutateAsync(formData);

    setSelectedItem(null);
    setSearchResults((prev) =>
      prev.filter(
        (searchResult) => searchResult.parsedId !== selectedItem?.parsedId,
      ),
    );

    form.reset();

    toast.promise(promise, {
      loading: `Adding ${selectedItem.title}...`,
      success: `${selectedItem.title} added successfully!`,
      error: (error) => `Failed to add ${selectedItem.title}: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
