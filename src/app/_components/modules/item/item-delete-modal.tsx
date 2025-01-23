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
import { useDeleteItemFromCollection } from "../../../../hooks";
import { CardContainer } from "../../shared";

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
        <CardContainer className="w-full cursor-pointer gap-2 p-4 hover:scale-105">
          <Header vtag="h6" className="text-destructive">
            Delete from collection
          </Header>
        </CardContainer>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent className="sm:max-w-xl md:max-w-xl lg:max-w-xl">
        <div className="flex w-full flex-col justify-center rounded-sm bg-background p-4">
          <div className="flex w-full flex-col justify-between gap-4 p-6 sm:min-w-96">
            <Header vtag="h4" className=" ">
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
