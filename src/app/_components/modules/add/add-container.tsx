"use client";
import { useState } from "react";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";
import type {
  SearchResultType,
  SearchMediaFilterType,
} from "../../../../server/api/modules/parse/types";
import Link from "next/link";
import { Container, Loading, ScrollButton, Search } from "../../shared";
import {
  useDebouncedQueryParams,
  useGetUserTags,
  useQueryParams,
  useSearchItems,
} from "../../../../hooks";
import { api } from "../../../../trpc/react";
import type { z } from "zod";
import { SearchInputSchema } from "../../../../server/api/modules/parse/schemas";
import { cn } from "../../../../lib";

export const AddParamsSchema = SearchInputSchema.pick({
  query: true,
});

export type AddParamsType = z.infer<typeof AddParamsSchema>;

const SEARCH_ALL_COLLECTION_ID = "all" as const;

const MEDIA_FILTER_OPTIONS: SearchMediaFilterType[] = ["Film", "Serie", "Manga"];

function AddContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();

  const { getParam, setQueryParams } = useQueryParams<AddParamsType>({
    schema: AddParamsSchema,
    defaultParams: { query: "" },
  });

  const [query, setQuery] = useState(getParam("query"));
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResultType | null>(
    null,
  );
  const [mediaFilter, setMediaFilter] = useState<SearchMediaFilterType | null>(null);

  useDebouncedQueryParams<AddParamsType>({ query }, setQueryParams);

  const { tags } = useGetUserTags({
    collectionsIds: selectedItem?.suggestedCollectionId
      ? [selectedItem.suggestedCollectionId]
      : collections.map((c) => c.id),
  });

  const { isLoading, submit: baseSubmit } = useSearchItems({
    query,
    selectedCollectionId: SEARCH_ALL_COLLECTION_ID,
    setSearchResults,
    setSelectedItem,
  });

  const submit = () => {
    setMediaFilter(null);
    baseSubmit();
  };

  const toggleMediaFilter = (type: SearchMediaFilterType) => {
    setMediaFilter((prev) => (prev === type ? null : type));
  };

  const filteredResults = [
    ...(mediaFilter === null
      ? searchResults
      : searchResults.filter(
          (r) => (r.suggestedCollectionName ?? "Film") === mediaFilter,
        )),
  ].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));

  const hasResults = searchResults.length > 0;

  return (
    <Container>
      <Search
        autoFocus
        isLoading={isLoading}
        query={query}
        setQuery={setQuery}
        submit={submit}
      />

      {hasResults && !isLoading && (
        <div className="flex gap-2">
          {MEDIA_FILTER_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => toggleMediaFilter(type)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                mediaFilter === type
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {selectedItem && (
        <AddItemModal
          tags={tags}
          selectedItem={selectedItem}
          open={!!selectedItem}
          selectedCollectionId={
            selectedItem.suggestedCollectionId ?? collections[0]?.id ?? ""
          }
          setSelectedItem={setSelectedItem}
          setSearchResults={setSearchResults}
        />
      )}

      {!isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredResults.map((searchResult) =>
            searchResult.id ? (
              <Link
                key={searchResult.parsedId}
                href={`/item/${searchResult.id}`}
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
    </Container>
  );
}
export { AddContainer };
