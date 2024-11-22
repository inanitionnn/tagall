import React, { Dispatch, RefObject, SetStateAction } from "react";
import { Button } from "../../ui";
import { CollectionType } from "../../../../server/api/modules/collection/types";

type Props = {
  ref: RefObject<HTMLDivElement>;
  collections: CollectionType[];
  currentCollectionsIds: string[];
  setCurrentCollectionsIds: Dispatch<SetStateAction<string[]>>;
};

const HomeCollectionsTabs = (props: Props) => {
  const { ref, collections, currentCollectionsIds, setCurrentCollectionsIds } =
    props;

  const onClick = (collectionId: string) => {
    setCurrentCollectionsIds((prev) => {
      if (prev.includes(collectionId)) {
        return prev.filter((id) => id !== collectionId);
      }
      return [...prev, collectionId];
    });
  };

  return (
    <div
      ref={ref}
      className="inline-flex w-min items-center justify-center gap-2 rounded-md bg-background p-2 text-muted-foreground"
    >
      {collections.map((collection) => (
        <Button
          key={collection.id}
          onClick={() => onClick(collection.id)}
          variant={
            currentCollectionsIds.includes(collection.id) ? "default" : "ghost"
          }
        >
          {collection.name}
        </Button>
      ))}
    </div>
  );
};

export { HomeCollectionsTabs };
