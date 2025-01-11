import React from "react";
import { Button, Header, Paragraph } from "../../ui";
import Link from "next/link";
import { Plus } from "lucide-react";

const HomeNoItemsCard = () => {
  return (
    <div className="flex max-w-xl flex-col gap-6 rounded-lg bg-white p-8 shadow">
      <Header vtag="h4">Your collection is currently empty!</Header>

      <Paragraph>
        It looks like you haven&apos;t added any items yet. Start building your
        collection now and keep everything organized in one place.
      </Paragraph>

      <Link href="/add" className="w-full">
        <Button size={"lg"} className="w-full gap-2">
          <Plus size={20} className="stroke-[2.5px]" />
          Add Item
        </Button>
      </Link>
    </div>
  );
};

export { HomeNoItemsCard };
