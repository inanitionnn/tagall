import { useEffect, useState } from "react";
import { api } from "../../../../../trpc/react";
import { toast } from "sonner";

type Props = {
  currentCollectionId: string;
  setSearchResults: (results: any) => void;
  setCurrentItem: (item: any) => void;
  limit?: number;
};
export const useSearch = (props: Props) => {
  const { currentCollectionId, limit, setCurrentItem, setSearchResults } =
    props;

  const [query, setQuery] = useState("");

  const { data, isSuccess, isLoading, isError, refetch } =
    api.parse.search.useQuery(
      {
        collectionId: currentCollectionId,
        query,
        limit: limit || 10,
      },
      { enabled: false },
    );

  const submit = () => {
    if (!isLoading && query.length >= 1) {
      setCurrentItem(null);
      refetch();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setSearchResults(data);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch search results");
    }
  }, [isError]);

  useEffect(() => {
    if (currentCollectionId) {
      setSearchResults([]);
      setCurrentItem(null);
    }
  }, [currentCollectionId]);

  return {
    query,
    setQuery,
    submit,
    isLoading,
  };
};
