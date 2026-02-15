"use client";

import { api } from "../../trpc/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ItemType } from "../../server/api/modules/item/types";
import { toast } from "sonner";
import { invalidateItemQueries } from "../../lib/cache-invalidation";

const formSchema = z.object({
  imageSource: z.enum(["file", "url", "paste"]),
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  file: RefObject<HTMLInputElement>;
  item: ItemType;
  setOpen: Dispatch<SetStateAction<boolean>>;
  imageUrl: string;
  pastedImage: File | null;
};

export const useUpdateItemImage = (props: Props) => {
  const { item, file, setOpen, imageUrl, pastedImage } = props;

  const { mutateAsync } = api.item.updateItemImage.useMutation();
  const utils = api.useUtils();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      imageSource: "file",
    },
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const submit = async () => {
    const imageSource = form.getValues("imageSource");

    const uploadData: { id: string; imageUrl?: string; imageBase64?: string } = {
      id: item.id,
    };

    try {
      if (imageSource === "url" && imageUrl) {
        uploadData.imageUrl = imageUrl;
      } else if (imageSource === "paste" && pastedImage) {
        const base64 = await convertToBase64(pastedImage);
        uploadData.imageBase64 = base64;
      } else if (imageSource === "file" && file?.current?.files?.[0]) {
        const base64 = await convertToBase64(file.current.files[0]);
        uploadData.imageBase64 = base64;
      } else {
        throw new Error("No image provided");
      }

      const promise = mutateAsync(uploadData, {
        onSuccess: () => {
          void invalidateItemQueries(utils, {
            itemId: item.id,
          });
        },
      });

      setOpen(false);

      toast.promise(promise, {
        loading: `Uploading cover for ${item.title}...`,
        success: `Cover updated successfully!`,
        error: (error) => `Failed to update cover: ${error.message}`,
      });
    } catch (error) {
      const err = error as Error;
      toast.error(`Failed to process image: ${err.message}`);
    }
  };

  return {
    form,
    submit,
  };
};
