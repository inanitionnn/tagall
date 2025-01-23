import React from "react";
import type { ItemSmallType } from "../../../../server/api/modules/item/types";
import Link from "next/link";
import {
  HomeListItem,
  HomeLargeItem,
  HomeMediumItem,
  HomeSmallItem,
} from "./items-sizes";
import { Container } from "../../shared";

type Props = {
  itemsSize: "small" | "medium" | "list" | "large";
  items: ItemSmallType[];
  selectedCollectionsIds: string[];
};

const HomeItems = (props: Props) => {
  const { itemsSize, items, selectedCollectionsIds } = props;

  return (
    <>
      {itemsSize === "large" && (
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
          {items.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`} target="_blank">
              <HomeLargeItem
                key={item.id}
                item={item}
                selectedCollectionsIds={selectedCollectionsIds}
              />
            </Link>
          ))}
        </div>
      )}
      {itemsSize === "medium" && (
        <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`} target="_blank">
              <HomeMediumItem key={item.id} item={item} />
            </Link>
          ))}
        </div>
      )}
      {itemsSize === "small" && (
        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-y-4">
          {items.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`} target="_blank">
              <HomeSmallItem
                key={item.id}
                item={item}
                selectedCollectionsIds={selectedCollectionsIds}
              />
            </Link>
          ))}
        </div>
      )}

      {itemsSize === "list" && (
        <Container className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-y-1 p-8">
          {items.map((item, index) => (
            <Link key={item.id} href={`/item/${item.id}`} target="_blank">
              <HomeListItem
                index={index}
                key={item.id}
                item={item}
                selectedCollectionsIds={selectedCollectionsIds}
              />
            </Link>
          ))}
        </Container>
      )}
    </>
  );
};

export { HomeItems };
