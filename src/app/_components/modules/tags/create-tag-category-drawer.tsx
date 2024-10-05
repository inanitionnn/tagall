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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Header,
  Input,
  Switch,
} from "../../ui";
import {
  Bot,
  BotMessageSquare,
  Flag,
  type LucideIcon,
  Minus,
  Plus,
} from "lucide-react";
import { SelectTagIconDialog } from "./select-tag-icon-dialog";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const tagCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(64, "Name is too long"),
  priority: z
    .number()
    .min(0, "Priority must be at least 0")
    .max(100, "Priority must be less than or equal to 100")
    .optional(),
  autoAddTags: z.boolean(),
  autoAddToElement: z.boolean(),
});

const CreateTagCategoryDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [icon, setIcon] = useState<LucideIcon | null>(null);

  const utils = api.useUtils();
  const createCategory = api.tagCategory.create.useMutation({
    onSuccess: async () => {
      await utils.tagCategory.invalidate();
      resetForm();
    },
  });

  const form = useForm({
    resolver: zodResolver(tagCategorySchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      priority: 0,
      autoAddTags: false,
      autoAddToElement: false,
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      priority: 0,
      autoAddTags: false,
      autoAddToElement: false,
    });
    setIcon(null);
  };

  const onSubmit = (data: any) => {
    const formData = {
      ...data,
      icon: icon?.displayName,
    };

    setIsOpen(false);
    toast.promise(createCategory.mutateAsync(formData), {
      loading: "Creating category...",
      success: "Category created successfully!",
      error: (error) => `Failed to create category: ${error.message}`,
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <Button variant="outline" className="gap-2">
          <Plus /> Add category
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-lg flex-col items-center py-4">
          <Header vtag="h5" className="text-center">
            Create Tag Category
          </Header>
          <DrawerHeader className="w-full gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex items-start gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={() => (
                      <FormItem className="w-full rounded-lg border p-4">
                        <div className="flex flex-row items-center justify-between gap-4">
                          <FormControl>
                            <Input
                              autoFocus
                              placeholder="Enter category name"
                              {...form.register("name")}
                            />
                          </FormControl>
                          <SelectTagIconDialog
                            SelectedIcon={icon}
                            setSelectedIcon={setIcon}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="priority"
                  render={() => (
                    <FormItem>
                      <div className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2 text-base">
                            <Flag size={16} />
                            Priority
                          </FormLabel>
                          <FormDescription>
                            The priority determines which Tag Categories will be
                            displayed first, including when creating Elements
                            and searching through the Collection.
                          </FormDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            disabled={form.watch("priority") <= 0}
                            size={"icon"}
                            variant={"ghost"}
                            className="h-8 min-h-8 w-8 min-w-8"
                            onClick={() => {
                              form.setValue(
                                "priority",
                                form.watch("priority") - 1,
                              );
                            }}
                          >
                            <Minus />
                          </Button>
                          <FormControl>
                            <Input
                              type="number"
                              className="w-16"
                              max={100}
                              min={0}
                              {...form.register("priority", {
                                valueAsNumber: true,
                              })}
                              onChange={(e) => {
                                let value = parseInt(e.target.value, 10);
                                if (isNaN(value)) {
                                  value = 0;
                                }
                                if (value < 0) {
                                  value = 0;
                                } else if (value > 100) {
                                  value = 100;
                                }
                                form.setValue("priority", value);
                              }}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            disabled={form.watch("priority") >= 100}
                            size={"icon"}
                            variant={"ghost"}
                            className="h-8 min-h-8 w-8 min-w-8"
                            onClick={() => {
                              form.setValue(
                                "priority",
                                form.watch("priority") + 1,
                              );
                            }}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="autoAddTags"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2 text-base">
                          <Bot size={16} />
                          Auto new tags
                        </FormLabel>
                        <FormDescription>
                          Automatically add Tags to the Tag Category if the AI
                          deems it appropriate during the creation of a new
                          Element.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoAddToElement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-4 border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2 text-base">
                          <BotMessageSquare size={16} />
                          Auto add to elements
                        </FormLabel>
                        <FormDescription>
                          Automatically adds Tags from this Tag Category to the
                          element upon its creation.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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

export { CreateTagCategoryDrawer };
