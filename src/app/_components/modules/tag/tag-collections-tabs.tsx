import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../../ui";
import type { CollectionType } from "../../../../server/api/modules/collection/types";

type Props = {
  collections: CollectionType[];
  currentCollectionsIds: string[];
  setCurrentCollectionsIds: Dispatch<SetStateAction<string[]>>;
};

const TagCollectionsTabs = (props: Props) => {
  const { collections, currentCollectionsIds, setCurrentCollectionsIds } =
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
    <div className="inline-flex w-min items-center justify-center gap-2 rounded-md border border-zinc-300 bg-background p-2 text-muted-foreground shadow focus:border-primary dark:border-zinc-700">
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

export { TagCollectionsTabs };
