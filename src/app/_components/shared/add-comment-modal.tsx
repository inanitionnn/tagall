"use client";
import {
  AutosizeTextarea,
  Button,
  DualRangeSlider,
  Header,
  Input,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui";
import { useState } from "react";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
  STATUS_VALUES,
} from "../../../constants";
import type { ItemType } from "../../../server/api/modules/item/types";
import { useAddComment } from "../../../hooks";
import { CardContainer } from ".";

type Props = {
  item: ItemType;
};

const AddCommentModal = (props: Props) => {
  const { item } = props;

  const [open, setOpen] = useState(false);

  const { form, submit } = useAddComment({
    item,
    setOpen,
  });

  const status = form.watch("status");
  const rating = form.watch("rate");

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <CardContainer className="w-full cursor-pointer p-4 hover:scale-105">
          <Header vtag="h6">Add comment</Header>
        </CardContainer>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-4 sm:min-w-96"
          >
            <Header vtag="h4" className="line-clamp-2">
              {item.title}
            </Header>
            <FormField
              control={form.control}
              name="title"
              render={() => (
                <FormItem>
                  <div className="flex w-full flex-col items-start gap-2">
                    <FormLabel>Title:</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder="1 Season"
                        max={255}
                        onChange={(e) =>
                          form.setValue(
                            "title",
                            e.target.value ? e.target.value : null,
                          )
                        }
                        value={form.watch("title") ?? ""}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem>
                  <div className="flex w-full flex-col items-start gap-2">
                    <FormLabel>Description:</FormLabel>
                    <FormControl>
                      <AutosizeTextarea
                        placeholder="Good show, I liked it"
                        maxHeight={200}
                        maxLength={1000}
                        onChange={(e) =>
                          form.setValue(
                            "description",
                            e.target.value ? e.target.value : null,
                          )
                        }
                        value={form.watch("description") ?? ""}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={() => (
                <FormItem>
                  <div className="flex w-full items-center justify-between gap-2">
                    <Paragraph>
                      <FormLabel>Status:</FormLabel>
                      {"   "}
                      {STATUS_NAMES[status]}
                    </Paragraph>
                    <div className="flex gap-2">
                      {STATUS_VALUES.map((s) => {
                        const IconComponent = STATUS_ICONS[s];
                        return (
                          <FormControl key={s}>
                            <Button
                              size={"icon"}
                              variant={status === s ? "default" : "secondary"}
                              onClick={(e) => {
                                e.preventDefault();
                                form.setValue("status", s);
                              }}
                            >
                              <IconComponent size={16} />
                            </Button>
                          </FormControl>
                        );
                      })}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={() => (
                <FormItem>
                  <div className="flex w-full flex-col items-start gap-2">
                    <div className="flex w-full items-center justify-between gap-2">
                      <Paragraph>
                        <FormLabel>Rating:</FormLabel>
                        {"   "}
                        {rating}
                      </Paragraph>
                      <Paragraph>{RATING_NAMES[rating]}</Paragraph>
                    </div>

                    <DualRangeSlider
                      // label={(value) => value}
                      value={[rating]}
                      onValueChange={(value) =>
                        form.setValue("rate", value[0] ?? 0)
                      }
                      min={0}
                      max={10}
                      step={1}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={form.formState.isSubmitting}>
              Add comment
            </Button>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { AddCommentModal };
