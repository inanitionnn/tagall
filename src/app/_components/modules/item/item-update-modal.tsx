"use client";
import {
  Button,
  DualRangeSlider,
  Header,
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
import { Star } from "lucide-react";
import { useUpdateItem } from "./hooks/use-update-item.hook";
import { ItemStatus } from "@prisma/client";

type Props = {
  item: ItemType;
};

const ItemUpdateModal = (props: Props) => {
  const { item } = props;

  const [open, setOpen] = useState(false);

  const { rating, setRating, setStatus, status, submit } = useUpdateItem({
    item,
    setOpen,
  });

  const StatusIcon = STATUS_ICONS[item.status];

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex cursor-pointer flex-col gap-2 rounded-md bg-background p-4 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-md">
          <div className="flex items-center gap-2">
            <Header vtag="h6">Status:</Header>
            <div className="flex w-full items-center justify-between gap-1">
              <StatusIcon size={16} />
              <Paragraph>{STATUS_NAMES[item.status]}</Paragraph>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Header vtag="h6">Rate:</Header>
            {item.rate ? (
              <>
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-1">
                    <Paragraph className="font-semibold">{item.rate}</Paragraph>
                    <Star size={16} />
                  </div>
                  <Paragraph>{RATING_NAMES[item.rate]}</Paragraph>
                </div>
              </>
            ) : (
              <Paragraph>None</Paragraph>
            )}
          </div>
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <div className="flex w-full flex-col justify-center rounded-sm bg-background p-2">
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className="leading-tight">
              Update item
            </Header>
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
            </div>{" "}
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
            <Button onClick={submit}>Update</Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemUpdateModal };
