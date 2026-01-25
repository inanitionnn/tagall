"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
} from "react";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import type { SearchResultType } from "../../server/api/modules/parse/types";
import { DEFAULT_ADD_LIMIT } from "../../constants";

type Props = {
  query: string;
  isAdvancedSearch: boolean;
  selectedCollectionId: string;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
  setSelectedItem: Dispatch<SetStateAction<SearchResultType | null>>;
};
export const useSearchItems = (props: Props) => {
  const {
    query,
    selectedCollectionId,
    isAdvancedSearch,
    setSelectedItem,
    setSearchResults,
  } = props;

  const prevCollectionIdRef = useRef<string | null>(null);

  const { data, isFetching, isError, refetch } = api.parse.search.useQuery(
    {
      collectionId: selectedCollectionId,
      query: query.toLowerCase().trim(),
      isAdvancedSearch,
      limit: DEFAULT_ADD_LIMIT,
    },
    { enabled: false },
  );

  const submit = () => {
    const normalizedQuery = query.trim();
    if (!isFetching && normalizedQuery.length >= 1 && selectedCollectionId) {
      setSelectedItem(null);
      void refetch();
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch search results");
    }
  }, [isError]);

  useEffect(() => {
    if (data) {
      setSearchResults(data);
    }
  }, [data, setSearchResults]);

  useEffect(() => {
    const prev = prevCollectionIdRef.current;
    prevCollectionIdRef.current = selectedCollectionId;

    // Clear only when switching from one collection to another (not on mount, not when prev is empty)
    if (
      prev != null &&
      prev !== "" &&
      selectedCollectionId !== "" &&
      prev !== selectedCollectionId
    ) {
      setSearchResults([]);
      setSelectedItem(null);
    }
  }, [selectedCollectionId, setSearchResults, setSelectedItem]);

  return {
    submit,
    isLoading: isFetching,
  };
};
