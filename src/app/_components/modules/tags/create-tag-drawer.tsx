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
  FormMessage,
  Header,
  Input,
} from "../../ui";
import { Plus } from "lucide-react";
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
  tagCategoryId: string;
};

const CreateTagDrawer = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const createTag = api.tag.create.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
      form.reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(tagSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      tagCategoryId: props.tagCategoryId,
    };
    setIsOpen(false);
    toast.promise(createTag.mutateAsync(formData), {
      loading: "Creating tag...",
      success: "Tag created successfully!",
      error: (error) => `Failed to create tag: ${error.message}`,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <Button variant="outline" className="gap-2">
          <Plus /> Tag
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-lg flex-col items-center py-4">
          <Header vtag="h5" className="text-center">
            Create Tag
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
              Create
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export { CreateTagDrawer };
