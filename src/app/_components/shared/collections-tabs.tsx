import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui";
import type { CollectionType } from "../../../server/api/modules/collection/types";
import { CardContainer } from "./card-container";
import type { GetUserItemsFilterType } from "../../../server/api/modules/item/types";

type Props = {
  collections: CollectionType[];
  selectedCollectionsIds: string[];
  setSelectedCollectionsIds: Dispatch<SetStateAction<string[]>>;
  setFiltering?: (value: GetUserItemsFilterType) => void;
};

export const CollectionsTabs = (props: Props) => {
  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    setFiltering,
  } = props;

  const onClick = (collectionId: string) => {
    if (setFiltering) setFiltering([]);

    setSelectedCollectionsIds((prev) => {
      if (prev.includes(collectionId)) {
        return prev.filter((id) => id !== collectionId);
      }
      return [...prev, collectionId];
    });
  };

  return (
    <CardContainer className="w-min">
      {collections.map((collection) => (
        <Button
          key={collection.id}
          onClick={() => onClick(collection.id)}
          variant={
            selectedCollectionsIds.includes(collection.id) ? "default" : "ghost"
          }
        >
          {collection.name}
        </Button>
      ))}
    </CardContainer>
  );
};
