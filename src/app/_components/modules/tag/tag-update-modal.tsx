"use client";
import {
  Button,
  Header,
  Input,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Paragraph,
  Badge,
} from "../../ui";
import { useState } from "react";
import type { TagType } from "../../../../server/api/modules/tag/types/tag.type";
import { useUpdateTag } from "./hooks/use-update-tag.hook";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import { useDeleteTag } from "./hooks/use-delete-tag.hook";

type Props = {
  tag: TagType;
  collections: CollectionType[];
};

const TagUpdateModal = (props: Props) => {
  const { tag, collections } = props;
  const [open, setOpen] = useState(false);

  const { form, submit } = useUpdateTag({
    tag,
    setOpen,
  });
  const { submit: deleteSubmit } = useDeleteTag({
    tag,
    setOpen,
  });

  const collectionsIds = form.watch("collectionsIds");

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex cursor-pointer flex-col gap-4 rounded-md border border-zinc-300 bg-background p-4 shadow focus:border-primary dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <Header vtag="h5" className="leading-tight">
              {tag.name}
            </Header>
            <Paragraph className="text-muted-foreground">
              {tag._count.userToItems} items
            </Paragraph>
          </div>
          <div className="flex flex-wrap gap-2">
            {tag.collections.map((collection) => (
              <Badge
                key={collection.id}
                variant={"outline"}
                className="px-4 py-2"
              >
                {collection.name}
              </Badge>
            ))}
          </div>
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-8 sm:min-w-96"
          >
            <Header vtag="h4" className="leading-tight">
              Update tag
            </Header>
            <FormField
              control={form.control}
              name="name"
              render={() => (
                <FormItem>
                  <div className="flex w-full flex-col items-start gap-2">
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="Favorite"
                        max={255}
                        {...form.register("name")}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="collectionsIds"
              render={() => (
                <FormItem>
                  <div className="flex w-full items-center justify-between gap-2">
                    <FormLabel>Collections:</FormLabel>

                    <div className="flex gap-2">
                      {collections.map((collection) => (
                        <FormControl key={collection.id}>
                          <Button
                            size={"sm"}
                            variant={
                              collectionsIds?.find((c) => c === collection.id)
                                ? "default"
                                : "secondary"
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              form.setValue(
                                "collectionsIds",
                                collectionsIds.includes(collection.id)
                                  ? collectionsIds.filter(
                                      (c) => c !== collection.id,
                                    )
                                  : [...collectionsIds, collection.id],
                              );
                            }}
                          >
                            {collection.name}
                          </Button>
                        </FormControl>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  deleteSubmit();
                }}
              >
                Delete tag
              </Button>

              <Button className="w-full" disabled={form.formState.isSubmitting}>
                Update tag
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { TagUpdateModal };
