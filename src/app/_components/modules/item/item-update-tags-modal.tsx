"use client";
import {
  Button,
  Header,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Badge,
} from "../../ui";
import { useState } from "react";
import type { ItemType } from "../../../../server/api/modules/item/types";
import Container from "../../shared/container";
import { useUpdateItem } from "./hooks/use-update-item.hook";
import type { TagType } from "../../../../server/api/modules/tag/types/tag.type";

type Props = {
  item: ItemType;
  tags: TagType[];
};

const ItemUpdateTagsModal = (props: Props) => {
  const { item, tags } = props;
  const [open, setOpen] = useState(false);

  const { form, submit } = useUpdateItem({
    item,
    setOpen,
  });

  const tagsIds = form.watch("tagsIds");

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Container className="hover:scape-105 cursor-pointer flex-col p-4">
          <Header vtag="h6">Tags:</Header>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        </Container>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-8 sm:min-w-96"
          >
            <Header vtag="h4" className=" ">
              Update tags
            </Header>

            <FormField
              control={form.control}
              name="tagsIds"
              render={() => (
                <FormItem>
                  <div className="flex w-full flex-col gap-2">
                    <Paragraph>
                      <FormLabel>Tags:</FormLabel>
                    </Paragraph>
                    <div className="flew-wrap flex gap-2">
                      {tags.map((tag) => (
                        <FormControl key={tag.id}>
                          <Button
                            size={"sm"}
                            variant={
                              tagsIds.includes(tag.id) ? "default" : "secondary"
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              form.setValue(
                                "tagsIds",
                                tagsIds.includes(tag.id)
                                  ? tagsIds.filter((id) => id !== tag.id)
                                  : [...tagsIds, tag.id],
                              );
                            }}
                          >
                            {tag.name}
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
              Update
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemUpdateTagsModal };
