"use client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { AddSearch } from "./add-search";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import { AddCollectionsTabs } from "./add-collections-tabs";
import { useSearch } from "./hooks/use-search.hook";
import Link from "next/link";
import { useGetUserTags } from "../tag/hooks/use-get-user-tags.hook";

function AddContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();

  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    collections[0]?.id ?? "",
  );

  const { tags } = useGetUserTags({
    collectionsIds: [selectedCollectionId],
  });

  const [selectedItem, setSelectedItem] = useState<SearchResultType | null>(
    null,
  );

  const LIMIT = 16;

  const { isLoading, query, setQuery, submit } = useSearch({
    selectedCollectionId,
    setSearchResults,
    setSelectedItem,
    limit: LIMIT,
  });

  return (
    <div className="flex max-w-screen-2xl flex-col gap-8 p-8">
      <AddCollectionsTabs
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
      />
      <AddSearch
        isLoading={isLoading}
        query={query}
        setQuery={setQuery}
        submit={submit}
      />

      {selectedItem && (
        <AddItemModal
          tags={tags}
          selectedItem={selectedItem}
          open={!!selectedItem}
          selectedCollectionId={selectedCollectionId}
          setSelectedItem={setSelectedItem}
          setSearchResults={setSearchResults}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {searchResults.map((searchResult) =>
          searchResult.id ? (
            <Link
              key={searchResult.parsedId}
              href={`/item/${searchResult.id}`}
              target="_blank"
            >
              <AddSearchResultItem
                searchResult={searchResult}
                setSelectedItem={setSelectedItem}
              />
            </Link>
          ) : (
            <AddSearchResultItem
              key={searchResult.parsedId}
              searchResult={searchResult}
              setSelectedItem={setSelectedItem}
            />
          ),
        )}
      </div>
    </div>
  );
}
export { AddContainer };
