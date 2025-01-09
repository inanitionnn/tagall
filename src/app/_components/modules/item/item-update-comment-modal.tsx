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
  Separator,
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

type Props = {
  comment: NonNullable<ItemType["comments"]>[number];
};

const ItemUpdateCommentModal = (props: Props) => {
  const { comment } = props;
  const [open, setOpen] = useState(false);

  const {
    description,
    rating,
    setDescription,
    setRating,
    status,
    setStatus,
    setTitle,
    submit,
    title,
  } = useUpdateComment({
    comment,
    setOpen,
  });

  const { submit: deleteComment } = useDeleteComment({
    comment,
    setOpen,
  });

  const StatusIcon = STATUS_ICONS[comment.status];

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex cursor-pointer flex-col gap-4 rounded-md bg-background p-4 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-md md:p-8">
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
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <div className="flex w-full flex-col justify-center rounded-sm bg-background p-2">
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className="leading-tight">
              Update comment
            </Header>
            <Separator />
            <div className="flex w-full flex-col items-start gap-2">
              <Paragraph>
                <b>Title:</b>
              </Paragraph>
              <div className="w-full">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="1 Season"
                  max={255}
                />
              </div>
            </div>
            <Separator />
            <div className="flex w-full flex-col items-start gap-2">
              <Paragraph>
                <b>Description:</b>
              </Paragraph>
              <div className="w-full">
                <AutosizeTextarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Good show, I liked it"
                  maxHeight={200}
                  maxLength={1000}
                />
              </div>
            </div>
            <Separator />
            <div className="flex w-full items-center justify-between gap-2">
              <Paragraph>
                <b>Status:</b>
                {"   "}
                {STATUS_NAMES[status]}
              </Paragraph>
              <div className="flex gap-2">
                {Object.values(ItemStatus)
                  .reverse()
                  .map((s) => {
                    const IconComponent = STATUS_ICONS[s];
                    return (
                      <Button
                        key={s}
                        size={"icon"}
                        variant={status === s ? "default" : "secondary"}
                        onClick={() => setStatus(s)}
                      >
                        <IconComponent size={16} />
                      </Button>
                    );
                  })}
              </div>
            </div>
            <Separator />
            <div className="flex w-full flex-col items-start gap-2">
              <div className="flex w-full items-center justify-between gap-2">
                <Paragraph>
                  <b>Rating:</b> {rating[0] ? rating[0] : "None"}
                </Paragraph>
                <Paragraph>
                  {rating[0] ? RATING_NAMES[rating[0]] : "Don't know"}
                </Paragraph>
              </div>
              <DualRangeSlider
                // label={(value) => value}
                value={rating}
                onValueChange={setRating}
                min={0}
                max={10}
                step={1}
              />
            </div>
            <Separator />
            <div className="flex w-full items-center gap-4">
              <Button variant={"destructive"} onClick={deleteComment}>
                Delete comment
              </Button>

              <Button className="w-full" onClick={submit}>
                Add comment
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemUpdateCommentModal };
