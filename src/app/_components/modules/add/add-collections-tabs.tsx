import type { Dispatch, SetStateAction } from "react";
import { Button } from "../../ui";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import Container from "../../shared/container";

type Props = {
  collections: CollectionType[];
  currentCollectionId: string;
  setCurrentCollectionId: Dispatch<SetStateAction<string>>;
};

const AddCollectionsTabs = (props: Props) => {
  const { collections, currentCollectionId, setCurrentCollectionId } = props;

  return (
    <Container className="w-min">
      {collections.map((collection) => (
        <Button
          key={collection.id}
          onClick={() => setCurrentCollectionId(collection.id)}
          variant={currentCollectionId === collection.id ? "default" : "ghost"}
        >
          {collection.name}
        </Button>
      ))}
    </Container>
  );
};

export { AddCollectionsTabs };
