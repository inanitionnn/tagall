"use client";

import type { Dispatch, SetStateAction } from "react";
import { ItemStatus } from "@prisma/client";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import type {
  ItemSmallType,
  ItemType,
} from "../../server/api/modules/item/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z
  .object({
    title: z.string().min(1).max(255).nullable().optional(),
    description: z.string().min(1).max(1000).nullable().optional(),
    rate: z.number().int().min(0).max(10),
    status: z.nativeEnum(ItemStatus),
  })
  .refine((data) => data.title || data.description, {
    message: "Either title or description must be provided.",
    path: ["title"],
  });

type formDataType = z.infer<typeof formSchema>;

type Props = {
  item: ItemType | ItemSmallType;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useAddComment = (props: Props) => {
  const { item, setOpen } = props;

  const { mutateAsync } = api.itemComment.addItemComment.useMutation();

  const utils = api.useUtils();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      title: null,
      description: null,
      rate: item.rate ?? 0,
      status: item.status,
    },
  });

  const submit = async (data: formDataType) => {
    const formData = {
      ...data,
      itemId: item.id,
    };

    const promise = mutateAsync(formData, {
      onSuccess: () => {
        utils.item.invalidate();
      },
    });

    setOpen(false);

    form.reset();

    toast.promise(promise, {
      loading: `Adding comment...`,
      success: `Comment added successfully!`,
      error: (error) => `Failed to add comment: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
