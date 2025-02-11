"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import type { SearchResultType } from "../../server/api/modules/parse/types";

type Props = {
  query: string;
  isAdvancedSearch: boolean;
  selectedCollectionId: string;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
  setSelectedItem: Dispatch<SetStateAction<SearchResultType | null>>;
  limit?: number;
};
export const useSearchItems = (props: Props) => {
  const {
    query,
    limit,
    selectedCollectionId,
    isAdvancedSearch,
    setSelectedItem,
    setSearchResults,
  } = props;

  const LIMIT = limit || 10;

  const { data, isSuccess, isLoading, isError, refetch } =
    api.parse.search.useQuery(
      {
        collectionId: selectedCollectionId,
        query: query.toLowerCase().trim(),
        isAdvancedSearch,
        limit: LIMIT,
      },
      { enabled: false },
    );

  const submit = () => {
    if (!isLoading && query.length >= 1) {
      setSelectedItem(null);
      refetch();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setSearchResults(data);
    }
  }, [isSuccess, data, setSearchResults]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch search results");
    }
  }, [isError]);

  useEffect(() => {
    if (selectedCollectionId) {
      setSearchResults([]);
      setSelectedItem(null);
    }
  }, [selectedCollectionId, setSearchResults, setSelectedItem]);

  return {
    submit,
    isLoading,
  };
};
