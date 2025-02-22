import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui";
import type { CollectionType } from "../../../server/api/modules/collection/types";
import { CardContainer } from "./card-container";

type Props = {
  collections: CollectionType[];
  selectedCollectionsIds: string[];
  setSelectedCollectionsIds: Dispatch<SetStateAction<string[]>>;
  clear?: () => void;
};

export const CollectionsTabs = (props: Props) => {
  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    clear,
  } = props;

  const onClick = (collectionId: string) => {
    if (clear) clear();

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
