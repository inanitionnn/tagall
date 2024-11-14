"use client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { AddTabs } from "./add-tabs";
import { PARSE_TYPES } from "../../../../server/types";
import { AddSearch } from "./add-search";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";

function AddContainer() {
  const [searchResults, setSearchResults] = useState<
    PARSE_TYPES.SearchResult[]
  >([]);
  const [collections] = api.collection.getAll.useSuspenseQuery();
  const [currentCollectionId, setCurrentCollectionId] = useState<string>(
    collections[0]?.id || "",
  );
  const [currentItem, setCurrentItem] =
    useState<PARSE_TYPES.SearchResult | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <AddTabs
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
