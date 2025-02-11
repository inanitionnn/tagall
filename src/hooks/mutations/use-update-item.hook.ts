"use client";

import type { Dispatch, SetStateAction } from "react";
import { ItemStatus } from "@prisma/client";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import type { ItemType } from "../../server/api/modules/item/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  rate: z.number().int().min(0).max(10),
  status: z.nativeEnum(ItemStatus),
  tagsIds: z.array(z.string().cuid()),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  item: ItemType;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useUpdateItem = (props: Props) => {
  const { item, setOpen } = props;

  const { mutateAsync } = api.item.updateItem.useMutation();

  const utils = api.useUtils();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      rate: item.rate ?? 0,
      status: item.status,
      tagsIds: item.tags.map((tag) => tag.id),
    },
  });

  const submit = async (data: formDataType) => {
    const formData = {
      ...data,
      id: item.id,
    };

    const promise = mutateAsync(formData, {
      onSuccess: () => {
        utils.item.invalidate();
      },
    });

    setOpen(false);

    item.rate = data.rate;
    item.status = data.status;

    toast.promise(promise, {
      loading: `Updating ${item.title}...`,
      success: `${item.title} updated successfully!`,
      error: (error) => `Failed to update ${item.title}: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
