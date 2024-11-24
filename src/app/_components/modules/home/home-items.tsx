import React from "react";
import { ItemType } from "../../../../server/api/modules/item/types";
import { HomeSmallItem } from "./items-sizes/home-small-item";
import { HomeMediumItem } from "./items-sizes/home-medium-item";
import { HomeListItem } from "./items-sizes/home-list-item";

type Props = {
  itemsSize: "small" | "medium" | "list";
  items: ItemType[];
};

const HomeItems = (props: Props) => {
  const { itemsSize, items } = props;

  return (
    <>
      {itemsSize === "small" && (
        <div className="mx-auto grid max-w-screen-2xl grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <HomeSmallItem key={item.id} item={item} />
          ))}
        </div>
      )}
      {itemsSize === "medium" && (
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
          {items.map((item) => (
            <HomeMediumItem key={item.id} item={item} />
          ))}
        </div>
      )}
      {itemsSize === "list" && (
        <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-y-6">
          {items.map((item) => (
            <HomeListItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
};

export { HomeItems };
