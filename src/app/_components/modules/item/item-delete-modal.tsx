"use client";
import type { ItemType } from "../../../../server/api/modules/item/types";
import {
  Button,
  Header,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Separator,
} from "../../ui";
import { useState } from "react";
import { useDeleteItemFromCollection } from "./hooks/use-delete-item-from-collection.hook";

type Props = {
  item: ItemType;
};

const ItemDeleteModal = (props: Props) => {
  const { item } = props;
  const [open, setOpen] = useState(false);
  const { submit } = useDeleteItemFromCollection({
    item,
    setOpen,
  });
  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-md bg-background p-4 shadow transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
          <Header vtag="h6" className="text-destructive">
            Delete from collection
          </Header>
        </div>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="p-0 sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <div className="flex w-full flex-col justify-center rounded-sm bg-background p-2">
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className="leading-tight">
              Delete from collection
            </Header>
            <Separator />
            <div className="flex w-full items-center justify-between gap-2">
              <Paragraph>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </Paragraph>
            </div>
            <Separator />
            <Button onClick={submit}>Delete</Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { ItemDeleteModal };
