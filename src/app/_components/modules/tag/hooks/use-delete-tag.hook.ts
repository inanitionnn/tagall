import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import type { TagType } from "../../../../../server/api/modules/tag/types/tag.type";

type Props = {
  tag: TagType;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useDeleteTag = (props: Props) => {
  const { setOpen, tag } = props;
  const { mutateAsync } = api.tag.deleteTag.useMutation();

  const utils = api.useUtils();

  const submit = async () => {
    const promise = mutateAsync(tag.id, {
      onSuccess: () => {
        utils.tag.invalidate();
      },
    });

    setOpen(false);

    toast.promise(promise, {
      loading: `Deleting tag...`,
      success: `Tag deleted successfully!`,
      error: (error) => `Failed to delete tag: ${error.message}`,
    });
  };

  return {
    submit,
  };
};
