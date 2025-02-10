import { useEffect, useState } from "react";
import { api } from "../../trpc/react";
import { useDebounce } from "../utils";

export const useGetUserCollections = () => {
  const DEBOUNCE = 2000;

  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >(collections.map((collection) => collection.id));

  const debouncedSelectedCollectionsIds = useDebounce(
    selectedCollectionsIds,
    DEBOUNCE,
  );

  useEffect(() => {
    console.log("main", debouncedSelectedCollectionsIds);
  }, [debouncedSelectedCollectionsIds]);

  return {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  };
};
