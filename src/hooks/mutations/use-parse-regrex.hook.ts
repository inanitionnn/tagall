"use client";

import { type Dispatch, type SetStateAction, useEffect } from "react";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import type { ParseRegrexResult } from "../../server/api/modules/parse/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  url: z.string().url(),
  htmlQuery: z.string().min(1).max(2000),
  userMessage: z.string().max(1000),
  collectionId: z.string().cuid(),
});

type formDataType = z.infer<typeof formSchema>;

type Props = {
  defaultCollectionId: string;
  setItems: Dispatch<SetStateAction<ParseRegrexResult[]>>;
};

export const useParseRegrex = (props: Props) => {
  const { setItems, defaultCollectionId } = props;

  const { data, isSuccess, mutateAsync } = api.parse.regrex.useMutation();

  const form = useForm<formDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      htmlQuery: "",
      url: "",
      userMessage: "",
      collectionId: defaultCollectionId,
    },
  });

  const submit = async (data: formDataType) => {
    const { htmlQuery, url, userMessage, collectionId } = data;
    const promise = mutateAsync({
      htmlQuery,
      url,
      userMessage: userMessage || undefined,
      collectionId,
    });

    toast.promise(promise, {
      loading: `Parsing...`,
      success: `Parsed successfully!`,
      error: (error) => `Failed to parse: ${error.message}`,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setItems(data);
    }
  }, [data, setItems]);

  return {
    submit,
    form,
  };
};
