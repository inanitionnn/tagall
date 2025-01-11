import { type Dispatch, type SetStateAction } from "react";
import { ItemStatus } from "@prisma/client";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../../../../../server/api/modules/item/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    title: z.string().min(1).max(255).nullable().optional(),
    description: z.string().min(1).max(1000).nullable().optional(),
    rate: z.number().int().min(0).max(10).optional(),
    status: z.nativeEnum(ItemStatus).optional(),
  })
  .refine((data) => data.title || data.description, {
    message: "Either title or description must be provided.",
    path: ["title"],
  });

type Props = {
  comment: NonNullable<ItemType["comments"]>[number];
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useUpdateComment = (props: Props) => {
  const { comment, setOpen } = props;
  const { mutateAsync } = api.itemComment.updateItemComment.useMutation();

  const utils = api.useUtils();

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      title: comment.title,
      description: comment.description,
      rate: comment.rate ?? 0,
      status: comment.status,
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    const formData = {
      ...data,
      id: comment.id,
    };

    const promise = mutateAsync(formData, {
      onSuccess: () => {
        utils.item.invalidate();
      },
    });

    setOpen(false);

    toast.promise(promise, {
      loading: `Updating comment...`,
      success: `Comment updated successfully!`,
      error: (error) => `Failed to update comment: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
