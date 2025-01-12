import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";
import type { SearchResultType } from "../../../../../server/api/modules/parse/types";

type Props = {
  selectedCollectionId: string;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
  setSelectedItem: Dispatch<SetStateAction<SearchResultType | null>>;
  limit: number;
};
export const useSearch = (props: Props) => {
  const { limit, selectedCollectionId, setSelectedItem, setSearchResults } =
    props;

  const [query, setQuery] = useState("");

  const { data, isSuccess, isLoading, isError, refetch } =
    api.parse.search.useQuery(
      {
        collectionId: selectedCollectionId,
        query,
        limit: limit,
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
    query,
    setQuery,
    submit,
    isLoading,
  };
};
