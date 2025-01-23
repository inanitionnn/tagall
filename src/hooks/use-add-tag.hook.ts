import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, SetStateAction } from "react";
import { api } from "../trpc/react";

const formSchema = z.object({
  name: z.string().min(1).max(255),
  collectionsIds: z.array(z.string().cuid()).refine((arr) => arr.length > 0, {
    message: "Select at least one collection",
  }),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const useAddTag = (props: Props) => {
  const { setOpen } = props;

  const { mutateAsync } = api.tag.addTag.useMutation();

  const utils = api.useUtils();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      collectionsIds: [],
    },
  });

  const submit = async (data: formDataType) => {
    const promise = mutateAsync(data, {
      onSuccess: () => {
        utils.tag.invalidate();
      },
    });

    setOpen(false);

    form.reset();

    toast.promise(promise, {
      loading: `Adding tag...`,
      success: `Tag added successfully!`,
      error: (error) => `Failed to add tag: ${error.message}`,
    });
  };

  return {
    form,
    submit,
  };
};
