import type { Dispatch, SetStateAction } from "react";
import { Button } from "../../ui";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import { Container } from "../../shared";

type Props = {
  collections: CollectionType[];
  selectedCollectionId: string;
  setSelectedCollectionId: Dispatch<SetStateAction<string>>;
};

const AddCollectionsTabs = (props: Props) => {
  const { collections, selectedCollectionId, setSelectedCollectionId } = props;

  return (
    <Container className="w-min">
      {collections.map((collection) => (
        <Button
          key={collection.id}
          onClick={() => setSelectedCollectionId(collection.id)}
          variant={selectedCollectionId === collection.id ? "default" : "ghost"}
        >
          {collection.name}
        </Button>
      ))}
    </Container>
  );
};

export { AddCollectionsTabs };
