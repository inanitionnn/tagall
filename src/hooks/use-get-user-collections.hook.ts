import { useState } from "react";
import { api } from "../trpc/react";
import { useDebounce } from "./use-debounce.hook";

export const useGetUserCollections = () => {
  const DEBOUNCE = 400;

  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >(collections.map((collection) => collection.id));

  const debouncedSelectedCollectionsIds = useDebounce(
    selectedCollectionsIds,
    DEBOUNCE,
  );

  return {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  };
};
