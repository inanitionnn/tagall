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
};

export const CollectionsTabs = (props: Props) => {
  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    isMany = true,
    clear,
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
      setSelectedCollectionsIds([collectionId]);
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
