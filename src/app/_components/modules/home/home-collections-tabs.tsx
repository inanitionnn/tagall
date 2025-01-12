import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../../ui";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import Container from "../../shared/container";

type Props = {
  collections: CollectionType[];
  selectedCollectionsIds: string[];
  setselectedCollectionsIds: Dispatch<SetStateAction<string[]>>;
};

const HomeCollectionsTabs = (props: Props) => {
  const { collections, selectedCollectionsIds, setselectedCollectionsIds } =
    props;

  const onClick = (collectionId: string) => {
    setselectedCollectionsIds((prev) => {
      if (prev.includes(collectionId)) {
        return prev.filter((id) => id !== collectionId);
      }
      return [...prev, collectionId];
    });
  };

  return (
    <Container className="w-min">
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
    </Container>
  );
};

export { HomeCollectionsTabs };
