"use client";
import Image from "next/image";
import {
  Button,
  DualRangeSlider,
  Header,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  Separator,
} from "../../ui";
import type { Dispatch, SetStateAction } from "react";
import {
  RATING_NAMES,
  STATUS_ICONS,
  STATUS_NAMES,
} from "../../../../constants";
import { ItemStatus } from "@prisma/client";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import { useAddItemToCollection } from "./hooks/use-add-item-to-collection.hook";

type Props = {
  open: boolean;
  currentItem: SearchResultType;
  currentCollectionId: string;
  setCurrentItem: Dispatch<SetStateAction<SearchResultType | null>>;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
};

const AddItemModal = (props: Props) => {
  const { currentItem, open, setCurrentItem } = props;
  const { rating, setRating, setStatus, status, submit } =
    useAddItemToCollection(props);

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setCurrentItem(null);
        }
      }}
    >
      <ResponsiveModalContent className="p-0 sm:max-w-2xl md:max-w-2xl lg:max-w-3xl">
        <div className="flex min-h-64 w-full flex-col justify-center rounded-sm bg-background sm:flex-row sm:p-2">
          <div className="hidden aspect-[29/40] rounded-sm sm:block">
            {currentItem.image ? (
              <Image
                src={currentItem.image}
                alt={"cover" + currentItem.title}
                className="aspect-[29/40] rounded-sm object-cover"
                width={377}
                height={520}
              />
            ) : (
              <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
            )}
          </div>
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className="leading-tight">
              {currentItem.title}
            </Header>
            {[currentItem.year, ...currentItem.keywords].filter(Boolean)
              .length ? (
              <Paragraph>
                {[currentItem.year, ...currentItem.keywords]
                  .filter(Boolean)
                  .filter((item) => String(item).split(" ").length === 1)
                  .slice(0, 7)
                  .join(" • ")}
              </Paragraph>
            ) : null}

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
            <Button onClick={submit}>Add to collection</Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { AddItemModal };
