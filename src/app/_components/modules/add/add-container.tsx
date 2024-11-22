"use client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { AddSearch } from "./add-search";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";
import { SearchResultType } from "../../../../server/api/modules/parse/types";
import { AddCollectionsTabs } from "./add-collections-tabs";

function AddContainer() {
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [collections] = api.collection.getAll.useSuspenseQuery();
  const [currentCollectionId, setCurrentCollectionId] = useState<string>(
    collections[0]?.id || "",
  );
  const [currentItem, setCurrentItem] = useState<SearchResultType | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <AddCollectionsTabs
        collections={collections}
        currentCollectionId={currentCollectionId}
        setCurrentCollectionId={setCurrentCollectionId}
      />
      <AddSearch
        setSearchResults={setSearchResults}
        setCurrentItem={setCurrentItem}
        currentCollectionId={currentCollectionId}
      />

      {currentItem && (
        <AddItemModal
          currentItem={currentItem}
          open={!!currentItem}
          currentCollectionId={currentCollectionId}
          setCurrentItem={setCurrentItem}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {searchResults.map((searchResult) => (
          <AddSearchResultItem
            key={searchResult.link}
            searchResult={searchResult}
            setCurrentItem={setCurrentItem}
          />
        ))}
      </div>
    </div>
  );
}
export { AddContainer };
