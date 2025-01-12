"use client";
import {
  AutosizeTextarea,
  Button,
  DualRangeSlider,
  Header,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
} from "../../ui";
import { useState } from "react";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../constants";
import type { ItemType } from "../../../../server/api/modules/item/types";
import { ItemStatus } from "@prisma/client";
import { Star } from "lucide-react";
import { useUpdateComment } from "./hooks/use-update-comment.hook";
import { useDeleteComment } from "./hooks/use-delete-comment.hook";
import Container from "../../shared/container";

type Props = {
  comment: NonNullable<ItemType["comments"]>[number];
};

const ItemUpdateCommentModal = (props: Props) => {
  const { comment } = props;
  const [open, setOpen] = useState(false);

  const { form, submit } = useUpdateComment({
    comment,
    setOpen,
  });

  const { submit: deleteComment } = useDeleteComment({
    comment,
    setOpen,
  });

  const status = form.watch("status");
  const rating = form.watch("rate");

  const StatusIcon = STATUS_ICONS[comment.status];

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Container className="w-full cursor-pointer flex-col p-4 hover:scale-105">
          {comment.title && <Header vtag="h6">{comment.title}</Header>}
          {comment.description && (
            <Paragraph className="text-muted-foreground">
              {comment.description}
            </Paragraph>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Header vtag="h6">Status:</Header>
              <div className="flex w-full items-center gap-1">
                <StatusIcon size={16} />
                <Paragraph className="text-muted-foreground">
                  {STATUS_NAMES[comment.status]}
                </Paragraph>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Header vtag="h6">Rate:</Header>
              {comment.rate ? (
                <>
                  <div className="flex w-full gap-1">
                    <div className="flex items-center gap-1">
                      <Paragraph className="font-semibold">
                        {comment.rate}
                      </Paragraph>
                      <Star size={16} />
                    </div>
                    <Paragraph className="text-muted-foreground">
                      {RATING_NAMES[comment.rate]}
                    </Paragraph>
                  </div>
                </>
              ) : (
                <Paragraph>None</Paragraph>
              )}
            </div>
          </div>
          <Paragraph className="text-center text-muted-foreground">
            {comment.timeAgo}
          </Paragraph>
        </Container>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="flex w-full flex-col justify-between gap-4 rounded-sm bg-background p-8 sm:min-w-96"
          >
            <Header vtag="h4" className=" ">
              Update comment
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
                      {Object.values(ItemStatus)
                        .reverse()
                        .map((s) => {
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
            <div className="flex w-full items-center gap-4">
              <Button
                variant={"destructive"}
                onClick={(e) => {
                  e.preventDefault();
                  deleteComment();
                }}
              >
                Delete comment
              </Button>

              <Button className="w-full" disabled={form.formState.isSubmitting}>
                Add comment
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemUpdateCommentModal };
