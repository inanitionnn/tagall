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
import { CardContainer } from "../../shared";
import { useUpdateItem } from "../../../../hooks";
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
        <CardContainer className="cursor-pointer flex-col p-4 hover:scale-105">
          <Header vtag="h6">Tags:</Header>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
        </CardContainer>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-4 sm:min-w-96"
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
