import { api } from "../../../../../trpc/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { User } from "@prisma/client";
import { env } from "../../../../../env";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  image: z.string().nullable().optional(),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  file: RefObject<HTMLInputElement>;
  isFile: boolean;
  user: User;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useUpdateUser = (props: Props) => {
  const { user, file, isFile, setOpen } = props;
  const { mutateAsync } = api.user.updateUser.useMutation();

  const utils = api.useUtils();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: user.name || "",
      image: user.image || "",
    },
  });

  function extractId(input: string | null | undefined): string | null {
    if (!input) return null;
    const regex = /tagall\/\w+\/(\w+)/;
    const match = regex.exec(input)?.at(1);

    return match ?? null;
  }

  const uploadImage = async () => {
    if (!file?.current?.files?.[0]) {
      return null;
    }

    const formData = new FormData();

    formData.append("file", file.current.files[0]);
    formData.append("upload_preset", "tagall_profile");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    console.log(data.public_id);
    console.log(extractId(data.public_id));
    return extractId(data.public_id);
  };

  const submit = async (data: formDataType) => {
    const promise = uploadImage().then((imageId) =>
      mutateAsync(
        {
          name: data.name,
          image: isFile ? imageId || user.image : null,
        },
        {
          onSuccess: () => {
            utils.user.invalidate();
          },
        },
      ),
    );

    setOpen(false);

    toast.promise(promise, {
      loading: `Updating user...`,
      success: `User updated successfully!`,
      error: (error) => `Failed to update user: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
