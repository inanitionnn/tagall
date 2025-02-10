"use client";
import { useState } from "react";
import type { GetUserItemsSortType } from "../../../../server/api/modules/item/types";
import { Header, InfiniteScroll } from "../../ui";
import { HomeItemsSizeTabs, type ItemsSize } from "./home-items-size-tabs";
import { HomeSortSelect } from "./home-sort-select";
import { HomeItems } from "./home-items";
import { HomeFilterBadges } from "./home-filter-badges";
import { HomeNoItemsCard } from "./home-no-items-card";
import {
  Search,
  FilterDialog,
  ScrollButton,
  CollectionsTabs,
  Loading,
  Container,
} from "../../shared";
import {
  useGetUserCollections,
  useGetFilterFields,
  useGetUserItems,
  useGetUserTags,
  useParseFiltering,
  useYearsRange,
} from "../../../../hooks";

function HomeContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsSize, setItemsSize] = useState<ItemsSize>("medium");
  const [sorting, setSorting] = useState<GetUserItemsSortType>({
    type: "desc",
    name: "date",
  });

  const [searchFilter, setSearchFilter] = useState<string>("");

  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  } = useGetUserCollections();

  const { tags } = useGetUserTags({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { yearsRange } = useYearsRange({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { fieldGroups } = useGetFilterFields({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const {
    filtering,
    filterRates,
    filterYears,
    setFilterRates,
    setFilterYears,
    setFiltering,
  } = useParseFiltering({
    yearsRange,
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { groupedItems, setPage, hasMore, isLoading } = useGetUserItems({
    collectionsIds: selectedCollectionsIds,
    sorting,
    filtering,
    searchQuery,
  });

  if (!collections.length) {
    return (
      <div className="flex h-svh items-center justify-center p-6">
        <HomeNoItemsCard />
      </div>
    );
  }

  return (
    <Container>
      <div className="flex flex-wrap justify-between gap-4">
        <CollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
        />
        <HomeItemsSizeTabs itemsSize={itemsSize} setItemsSize={setItemsSize} />

        <HomeSortSelect setSorting={setSorting} sorting={sorting} />

        <FilterDialog
          tags={tags}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          filterRates={filterRates}
          setFilterRates={setFilterRates}
          filterYears={filterYears}
          setFilterYears={setFilterYears}
          filtering={filtering}
          setFiltering={setFiltering}
          yearsRange={yearsRange}
          fieldGroups={fieldGroups}
        />
      </div>

      <Search
        isLoading={isLoading}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      <HomeFilterBadges filtering={filtering} setFiltering={setFiltering} />
      {groupedItems.map((group, index) => (
        <div key={group.groupBy + index} className="flex flex-col gap-4">
          <Header vtag="h3">{group.groupBy}</Header>
          <HomeItems
            tags={tags}
            items={group.items}
            itemsSize={itemsSize}
            selectedCollectionsIds={selectedCollectionsIds}
          />
        </div>
      ))}

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={isLoading}
        next={() => setPage((prev) => prev + 1)}
      >
        {hasMore && <Loading />}
      </InfiniteScroll>

      <ScrollButton />
    </Container>
  );
}
export { HomeContainer };
