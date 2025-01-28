"use client";
import type {
  ItemSmallType,
  ItemType,
} from "../../../server/api/modules/item/types";
import {
  Button,
  Header,
  Paragraph,
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTrigger,
  Separator,
} from "../ui";
import { useState } from "react";
import { useDeleteItemFromCollection } from "../../../hooks";
import { CardContainer } from ".";

type Props = {
  item: ItemType | ItemSmallType;
};

const DeleteItemModal = (props: Props) => {
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
          <div className="flex w-full flex-col justify-between gap-8 p-6 sm:min-w-96">
            <Header vtag="h5">This action cannot be undone!</Header>

            <Paragraph className="line-clamp-5">
              Are you sure you want to delete &quot;<b>{item.title}</b>&quot;?
            </Paragraph>

            <Button onClick={submit} variant={"destructive"}>
              Delete item
            </Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export { DeleteItemModal };
