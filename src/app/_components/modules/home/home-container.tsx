"use client";
import { useState } from "react";
import { CollectionsTabs } from "../../shared/collections-tabs";
import type { GetUserItemsSortType } from "../../../../server/api/modules/item/types";
import { Header, InfiniteScroll, Spinner } from "../../ui";
import { HomeItemsSizeTabs, type ItemsSize } from "./home-items-size-tabs";
import { HomeSortSelect } from "./home-sort-select";
import { HomeItems } from "./home-items";
import { FilterDialog } from "../../shared/filter-dialog";
import { HomeFilterBadges } from "./home-filter-badges";
import { HomeNoItemsCard } from "./home-no-items-card";
import { ScrollButton } from "../../shared/scroll-button";
import { Search } from "../../shared/search";
import {
  useGetCollections,
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
  const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  } = useGetCollections();

  const { tags } = useGetUserTags({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { yearsRange } = useYearsRange({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { filterFieldGroups } = useGetFilterFields({
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
  });

  const { groupedItems, setPage, hasMore, isLoading } = useGetUserItems({
    collectionsIds: selectedCollectionsIds,
    sorting,
    filtering,
    searchQuery,
    tagsIds: selectedTagsIds,
  });

  if (!collections.length) {
    return (
      <div className="flex h-svh items-center justify-center p-6">
        <HomeNoItemsCard />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 p-8">
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
          selectedTagsIds={selectedTagsIds}
          setSelectedTagsIds={setSelectedTagsIds}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          filterRates={filterRates}
          setFilterRates={setFilterRates}
          filterYears={filterYears}
          setFilterYears={setFilterYears}
          filtering={filtering}
          setFiltering={setFiltering}
          yearsRange={yearsRange}
          filterFieldGroups={filterFieldGroups}
        />
      </div>

      <Search
        isLoading={isLoading}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      <HomeFilterBadges
        tags={tags}
        selectedTagsIds={selectedTagsIds}
        setSelectedTagsIds={setSelectedTagsIds}
        filtering={filtering}
        setFiltering={setFiltering}
      />
      {groupedItems.map((group, index) => (
        <div key={group.groupBy + index} className="flex flex-col gap-4">
          <Header vtag="h3">{group.groupBy}</Header>
          <HomeItems
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
        {hasMore && (
          <div className="flex w-full items-center justify-center gap-6">
            <Spinner size={"medium"} />
            <Header vtag="h5">loading</Header>
          </div>
        )}
      </InfiniteScroll>

      <ScrollButton />
    </div>
  );
}
export { HomeContainer };
