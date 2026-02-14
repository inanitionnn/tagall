import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../ui";
import type { CollectionType } from "../../../server/api/modules/collection/types";
import { CardContainer } from "./card-container";

type Props = {
  collections: CollectionType[];
  selectedCollectionsIds: string[];
  setSelectedCollectionsIds: Dispatch<SetStateAction<string[]>>;
  isMany?: boolean;
  clear?: () => void;
  allowDeselect?: boolean;
};

export const CollectionsTabs = (props: Props) => {
  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    isMany = true,
    clear,
    allowDeselect = true,
  } = props;

  const onClick = (collectionId: string) => {
    if (clear) clear();
    if (isMany) {
      setSelectedCollectionsIds((prev) => {
        if (prev.includes(collectionId)) {
          return prev.filter((id) => id !== collectionId);
        }
        return [...prev, collectionId];
      });
    } else {
      setSelectedCollectionsIds((prev) => {
        // If allowDeselect is false and already selected, don't change
        if (!allowDeselect && prev.includes(collectionId)) {
          return prev;
        }
        // Otherwise toggle
        if (prev.includes(collectionId)) {
          return [];
        }
        return [collectionId];
      });
    }
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
