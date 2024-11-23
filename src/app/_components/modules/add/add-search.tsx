"use client";
import { Input, Spinner } from "../../ui";
import { api } from "~/trpc/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { SearchResultType } from "../../../../server/api/modules/parse/types";

type Props = {
  currentCollectionId: string;
  setSearchResults: Dispatch<SetStateAction<SearchResultType[]>>;
  setCurrentItem: Dispatch<SetStateAction<SearchResultType | null>>;
};

function AddSearch(props: Props) {
  const { currentCollectionId, setSearchResults, setCurrentItem } = props;
  const [query, setQuery] = useState("");
  const { data, isSuccess, isLoading, isError, refetch } =
    api.parse.search.useQuery(
      {
        collectionId: currentCollectionId,
        query,
        limit: 10,
      },
      { enabled: false },
    );
  const onSubmit = () => {
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

  return (
    <div className="relative">
      <Input
        //   type="search"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search elements..."
        className="w-full rounded-md border border-zinc-300 px-4 py-2 pr-10 focus:border-primary focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
      />
      {isLoading ? (
        <Spinner className="absolute right-3 top-3 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
      ) : (
        <Search
          onClick={onSubmit}
          className="absolute right-3 top-1/2 z-30 h-5 w-5 -translate-y-1/2 cursor-pointer text-zinc-400 dark:text-zinc-500"
        />
      )}
    </div>
  );
}
export { AddSearch };
