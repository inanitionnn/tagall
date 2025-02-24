"use client";
import { useEffect, useState } from "react";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import Link from "next/link";
import {
  CardContainer,
  CollectionsTabs,
  Container,
  Loading,
  ScrollButton,
  Search,
} from "../../shared";
import {
  useDebounce,
  useDebouncedQueryParams,
  useGetUserTags,
  useQueryParams,
  useSearchItems,
} from "../../../../hooks";
import { api } from "../../../../trpc/react";
import { Label, Paragraph, Switch } from "../../ui";
import type { z } from "zod";
import { SearchInputSchema } from "../../../../server/api/modules/parse/schemas";

export const AddParamsSchema = SearchInputSchema.pick({
  collectionId: true,
  query: true,
  isAdvancedSearch: true,
});

export type AddParamsType = z.infer<typeof AddParamsSchema>;

function AddContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();

  const { getParam, setQueryParams } = useQueryParams<AddParamsType>({
    schema: AddParamsSchema,
    defaultParams: {
      isAdvancedSearch: false,
      collectionId: collections[0]?.id ?? "",
      query: "",
    },
  });

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(
    getParam("isAdvancedSearch"),
  );
  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >([getParam("collectionId")]);
  const [query, setQuery] = useState(getParam("query"));
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);
  const [selectedItem, setSelectedItem] = useState<SearchResultType | null>(
    null,
  );

  useDebouncedQueryParams<AddParamsType>(
    {
      isAdvancedSearch,
      collectionId: selectedCollectionsIds[0] ?? "",
      query,
    },
    setQueryParams,
  );

  const { tags } = useGetUserTags({
    collectionsIds: selectedCollectionsIds,
  });

  const { isLoading, submit } = useSearchItems({
    query,
    selectedCollectionId: selectedCollectionsIds[0] ?? "",
    setSearchResults,
    setSelectedItem,
    isAdvancedSearch,
  });

  return (
    <Container>
      <div className="flex flex-wrap justify-between gap-4">
        <CollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
        />
        {collections
          .filter((c) => !["film", "serie"].includes(c.name.toLowerCase()))
          .every((c) => c.id !== selectedCollectionsIds[0]) ? (
          <CardContainer className="items-center p-4">
            <Label htmlFor="advanced-search" className="cursor-pointer">
              <Paragraph>Advanced search</Paragraph>
            </Label>
            <Switch
              id="advanced-search"
              checked={isAdvancedSearch}
              onCheckedChange={setIsAdvancedSearch}
            />
          </CardContainer>
        ) : null}
      </div>

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
          selectedCollectionId={selectedCollectionsIds[0] ?? ""}
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
