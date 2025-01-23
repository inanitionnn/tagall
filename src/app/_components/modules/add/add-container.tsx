"use client";
import { useState } from "react";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import { AddCollectionsTabs } from "./add-collections-tabs";
import Link from "next/link";
import { Loading, ScrollButton, Search } from "../../shared";
import { useGetUserTags, useParseSearch } from "../../../../hooks";
import { api } from "../../../../trpc/react";

function AddContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();

  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResultType | null>(
    null,
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    collections[0]?.id ?? "",
  );

  const { tags } = useGetUserTags({
    collectionsIds: [selectedCollectionId],
  });

  const { isLoading, query, setQuery, submit } = useParseSearch({
    selectedCollectionId,
    setSearchResults,
    setSelectedItem,
    limit: 16,
  });

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 p-8">
      <AddCollectionsTabs
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
      />
      <Search
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

      {!isLoading ? (
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
      ) : (
        <Loading />
      )}

      <ScrollButton />
    </div>
  );
}
export { AddContainer };
