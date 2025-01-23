import { type Dispatch, type SetStateAction } from "react";
import { api } from "../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../server/api/modules/item/types";
import { useRouter } from "next/navigation";

type Props = {
  item: ItemType;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useDeleteItemFromCollection = (props: Props) => {
  const { item, setOpen } = props;

  const { mutateAsync } = api.item.deleteFromCollection.useMutation();

  const router = useRouter();

  const submit = async () => {
    const promise = mutateAsync(item.id);

    setOpen(false);

    toast.promise(promise, {
      loading: `Deleting ${item.title}...`,
      success: `${item.title} deleted successfully!`,
      error: (error) => `Failed to delete ${item.title}: ${error.message}`,
    });

    router.push("/");
  };

  return {
    submit,
  };
};
