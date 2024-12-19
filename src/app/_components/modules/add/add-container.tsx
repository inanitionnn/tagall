"use client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { AddSearch } from "./add-search";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import { AddCollectionsTabs } from "./add-collections-tabs";
import { useSearch } from "./hooks/use-search.hook";

function AddContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [currentCollectionId, setCurrentCollectionId] = useState<string>(
    collections[0]?.id ?? "",
  );
  const [currentItem, setCurrentItem] = useState<SearchResultType | null>(null);

  const { isLoading, query, setQuery, submit } = useSearch({
    currentCollectionId,
    setSearchResults,
    setCurrentItem,
  });

  return (
    <div className="flex flex-col gap-8 p-8">
      <AddCollectionsTabs
        collections={collections}
        currentCollectionId={currentCollectionId}
        setCurrentCollectionId={setCurrentCollectionId}
      />
      <AddSearch
        isLoading={isLoading}
        query={query}
        setQuery={setQuery}
        submit={submit}
      />

      {currentItem && (
        <AddItemModal
          currentItem={currentItem}
          open={!!currentItem}
          currentCollectionId={currentCollectionId}
          setCurrentItem={setCurrentItem}
          setSearchResults={setSearchResults}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {searchResults.map((searchResult) => (
          <AddSearchResultItem
            key={searchResult.parsedId}
            searchResult={searchResult}
            setCurrentItem={setCurrentItem}
          />
        ))}
      </div>
    </div>
  );
}
export { AddContainer };
