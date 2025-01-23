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
} from "../../ui";
import { useState } from "react";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import { CardContainer } from "../../shared";
import { useAddTag } from "../../../../hooks";

type Props = {
  collections: CollectionType[];
};

const TagAddModal = (props: Props) => {
  const { collections } = props;

  const [open, setOpen] = useState(false);

  const { form, submit } = useAddTag({
    setOpen,
  });

  const collectionsIds = form.watch("collectionsIds");

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <CardContainer className="w-min">
          <Button variant={"ghost"}>Add tag</Button>
        </CardContainer>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-4 sm:min-w-96"
          >
            <Header vtag="h4" className=" ">
              Add tag
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
                  <div className="flex w-full flex-col gap-2">
                    <FormLabel>Collections:</FormLabel>

                    <div className="flex flex-wrap gap-2">
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

            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Add tag
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { TagAddModal };
