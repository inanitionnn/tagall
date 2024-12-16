"use client";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";
import { Header, Paragraph } from "../../ui";
import CloudinaryImage from "../../shared/cloudinary-image";
import { UpdateItemStatusModal } from "./update-item-status-modal";
import { useState } from "react";
import { useUpdateItem } from "./hooks/use-update-item.hook";
import { UpdateItemRatingModal } from "./update-item-rating-modal";

type Props = {
  itemId: string;
};

function ItemContainer(props: Props) {
  const { itemId } = props;
  const [item] = api.item.getUserItem.useSuspenseQuery(itemId);

  if (!item) {
    redirect("/");
  }

  const [openStatus, setOpenStatus] = useState(false);
  const [openRating, setOpenRating] = useState(false);
  const { rating, setRating, setStatus, status, submit } = useUpdateItem({
    item,
    setOpenStatus,
    setOpenRating,
  });
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="grid grid-cols-[256px_auto] grid-rows-1 gap-4">
        <div className="aspect-[29/40] w-full">
          {item.image ? (
            <CloudinaryImage publicId={item.image} />
          ) : (
            <div className="aspect-[29/40] rounded-sm bg-primary object-cover" />
          )}
        </div>
        <div className="flex h-full flex-col gap-2 rounded-md bg-background p-8 shadow">
          <Header vtag="h4">{item.title}</Header>
          <Paragraph className="text-muted-foreground">
            {item.description}
          </Paragraph>
        </div>
      </div>

      <UpdateItemStatusModal
        item={item}
        status={status}
        open={openStatus}
        setOpen={setOpenStatus}
        setItemStatus={setStatus}
        submit={submit}
      />

      <UpdateItemRatingModal
        item={item}
        open={openRating}
        setOpen={setOpenRating}
        rating={rating}
        setRating={setRating}
        submit={submit}
      />

      <div className="flex w-64 flex-col gap-2 rounded-md bg-background p-4 shadow">
        <div className="flex flex-col">
          <Header vtag="h6">Year:</Header>
          <Paragraph className="text-muted-foreground">{item.year}</Paragraph>
        </div>
        {item.fieldGroups.map((group) => (
          <div key={group.name} className="flex flex-col">
            <Header vtag="h6">
              {group.name
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase())}
              :
            </Header>
            {group.fields.map((field) => (
              <Paragraph key={field} className="text-muted-foreground">
                {field}
              </Paragraph>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export { ItemContainer };
