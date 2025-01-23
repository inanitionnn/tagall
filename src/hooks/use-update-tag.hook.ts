import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, SetStateAction } from "react";
import type { TagType } from "../server/api/modules/tag/types/tag.type";
import { api } from "../trpc/react";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  collectionsIds: z.array(z.string().cuid()).refine((arr) => arr.length > 0, {
    message: "Select at least one collection",
  }),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  tag: TagType;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useUpdateTag = (props: Props) => {
  const { tag, setOpen } = props;

  const { mutateAsync } = api.tag.updateTag.useMutation();

  const utils = api.useUtils();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: tag.name,
      collectionsIds: tag.collections.map((collection) => collection.id),
    },
  });

  const submit = async (data: formDataType) => {
    const formData = {
      ...data,
      id: tag.id,
    };
    const promise = mutateAsync(formData, {
      onSuccess: () => {
        utils.tag.invalidate();
      },
    });

    setOpen(false);

    toast.promise(promise, {
      loading: `Updating tag...`,
      success: `Tag updated successfully!`,
      error: (error) => `Failed to update tag: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
