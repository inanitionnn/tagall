"use client";

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Header,
  Input,
} from "../../ui";
import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(64, "Name is too long"),
});

type Props = {
  id: string;
  name: string;
  tagCategoryId: string;
};

const UpdateTagDrawer = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const updateTag = api.tag.update.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
      form.reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(tagSchema),
    mode: "onBlur",
    defaultValues: props,
  });

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      id: props.id,
      tagCategoryId: props.tagCategoryId,
    };
    setIsOpen(false);
    toast.promise(updateTag.mutateAsync(formData), {
      loading: "Updating tag...",
      success: "Tag updated successfully!",
      error: (error) => `Failed to update tag: ${error.message}`,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <Button
          variant="ghost"
          size={"sm"}
          className="w-full justify-start gap-2"
        >
          <Pencil size={16} /> Update
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-lg flex-col items-center py-4">
          <Header vtag="h5" className="text-center">
            Update Tag
          </Header>
          <DrawerHeader className="w-full gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={() => (
                    <FormItem className="w-full rounded-lg border p-4">
                      <FormLabel className="text-base">Name</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="Enter category name"
                          {...form.register("name")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DrawerHeader>
          <DrawerFooter className="w-full flex-row">
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              Update
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { UpdateTagDrawer };
