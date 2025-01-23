import { useState } from "react";
import { api } from "../trpc/react";
import { useDebounce } from "./use-debounce.hook";

export const useGetCollections = () => {
  const DEBOUNCE = 300;

  const [collections] = api.collection.getAll.useSuspenseQuery();

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    collections[0]?.id ?? "",
  );
  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >(collections.map((collection) => collection.id));

  const debounce = useDebounce(
    {
      selectedCollectionsIds,
      selectedCollectionId,
    },
    DEBOUNCE,
  );

  return {
    collections,
    selectedCollectionId,
    setSelectedCollectionId,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionId: debounce.selectedCollectionId,
    debouncedSelectedCollectionsIds: debounce.selectedCollectionsIds,
  };
};
