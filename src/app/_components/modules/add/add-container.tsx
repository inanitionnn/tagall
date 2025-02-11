"use client";
import { useState } from "react";
import { AddSearchResultItem } from "./add-search-result-item";
import { AddItemModal } from "./add-item-modal";
import type { SearchResultType } from "../../../../server/api/modules/parse/types";
import { AddCollectionsTabs } from "./add-collections-tabs";
import Link from "next/link";
import {
  CardContainer,
  Container,
  Loading,
  ScrollButton,
  Search,
} from "../../shared";
import { useGetUserTags, useSearchItems } from "../../../../hooks";
import { api } from "../../../../trpc/react";
import { Label, Paragraph, Switch } from "../../ui";

function AddContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
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

  const { isLoading, query, setQuery, submit } = useSearchItems({
    selectedCollectionId,
    setSearchResults,
    setSelectedItem,
    limit: 10,
    isAdvancedSearch,
  });

  return (
    <Container>
      <div className="flex flex-wrap justify-between gap-4">
        <AddCollectionsTabs
          collections={collections}
          selectedCollectionId={selectedCollectionId}
          setSelectedCollectionId={setSelectedCollectionId}
        />
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
