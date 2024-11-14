import { Dispatch, SetStateAction } from "react";
import { Button } from "../../ui";

type Props = {
  collections: {
    name: string;
    priority: number;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  currentCollectionId: string;
  setCurrentCollectionId: Dispatch<SetStateAction<string>>;
};

const AddTabs = (props: Props) => {
  const { collections, currentCollectionId, setCurrentCollectionId } = props;

  return (
    <div className="inline-flex w-min items-center justify-center gap-2 rounded-md bg-background p-2 text-muted-foreground">
      {collections.map((collection) => (
        <Button
          key={collection.id}
          onClick={() => setCurrentCollectionId(collection.id)}
          variant={currentCollectionId === collection.id ? "default" : "ghost"}
        >
          {collection.name}
        </Button>
      ))}
    </div>
  );
};

export { AddTabs };
