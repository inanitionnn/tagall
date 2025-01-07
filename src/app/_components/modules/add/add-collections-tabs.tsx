import type { Dispatch, SetStateAction } from 'react';
import { Button } from '../../ui';
import type { CollectionType } from '../../../../server/api/modules/collection/types';

type Props = {
  collections: CollectionType[];
  currentCollectionId: string;
  setCurrentCollectionId: Dispatch<SetStateAction<string>>;
};

const AddCollectionsTabs = (props: Props) => {
  const { collections, currentCollectionId, setCurrentCollectionId } = props;

  return (
    <div className="inline-flex w-min items-center justify-center gap-2 rounded-md bg-background p-2 text-muted-foreground">
      {collections.map((collection) => (
        <Button
          key={collection.id}
          onClick={() => setCurrentCollectionId(collection.id)}
          variant={currentCollectionId === collection.id ? 'default' : 'ghost'}
        >
          {collection.name}
        </Button>
      ))}
    </div>
  );
};

export { AddCollectionsTabs };
