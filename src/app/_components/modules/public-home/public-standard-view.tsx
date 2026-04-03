"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
} from "../../../../server/api/modules/item/types";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import { InfiniteScroll } from "../../ui";
import { HomeSortSelect } from "../home/home-sort-select";
import {
  Search,
  FilterDialog,
  ScrollButton,
  Loading,
  NoItemsCard,
  FilterBadges,
  CollectionsTabs,
  ViewModeSwitcher,
} from "../../shared";
import {
  useGetPublicFilterFields,
  useGetPublicYearsRange,
  useGetPublicUserItems,
  useParseFiltering,
} from "../../../../hooks";
import { HomeLargeItem } from "../home/items-sizes";

type Props = {
  collections: CollectionType[];
  collectionsIds: string[];
  selectedCollectionsIds: string[];
  setSelectedCollectionsIds: Dispatch<SetStateAction<string[]>>;
  filtering: GetUserItemsFilterType;
  setFiltering: Dispatch<SetStateAction<GetUserItemsFilterType>>;
  sorting: GetUserItemsSortType;
  setSorting: Dispatch<SetStateAction<GetUserItemsSortType>>;
  handleClearFilters: () => void;
  viewMode: "standard" | "tierlist" | "random";
  onViewModeChange: (mode: "standard" | "tierlist" | "random") => void;
};

export function PublicStandardView(props: Props) {
  const {
    collections,
    collectionsIds,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    filtering,
    setFiltering,
    sorting,
    setSorting,
    handleClearFilters,
    viewMode,
    onViewModeChange,
  } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const { items, setPage, hasMore, isLoading, isFetching, queryData } = useGetPublicUserItems({
    collectionsIds,
    sorting,
    filtering,
    searchQuery,
  });

  const { fieldGroups } = useGetPublicFilterFields({ collectionsIds });
  const { yearsRange } = useGetPublicYearsRange({ collectionsIds });

  const {
    filterRates,
    setFilterRates,
    filterYears,
    setFilterYears,
  } = useParseFiltering({ filtering, setFiltering, yearsRange });

  return (
    <div className="flex flex-col gap-4">
      {/* Controls row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <ViewModeSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <CollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
          clear={handleClearFilters}
          isMany={false}
          allowDeselect={false}
        />
        <HomeSortSelect sorting={sorting} setSorting={setSorting} />
        <FilterDialog
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          filtering={filtering}
          setFiltering={setFiltering}
          fieldGroups={fieldGroups}
          yearsRange={yearsRange}
          filterRates={filterRates}
          setFilterRates={setFilterRates}
          filterYears={filterYears}
          setFilterYears={setFilterYears}
          tags={[]}
        />
      </div>

      {/* Search */}
      <Search query={searchQuery} setQuery={setSearchQuery} isLoading={isLoading} />

      {/* Filter Badges */}
      <FilterBadges filtering={filtering} setFiltering={setFiltering} />

      {/* Items */}
      {(isLoading || isFetching) && <Loading />}

      {!isLoading && !isFetching && queryData !== undefined && queryData.length === 0 && <NoItemsCard />}

      {items.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <HomeLargeItem
              key={item.id}
              item={item}
              selectedCollectionsIds={selectedCollectionsIds}
            />
          ))}
        </div>
      )}

      {hasMore && !isLoading && !isFetching && (
        <InfiniteScroll
          isLoading={isLoading}
          hasMore={hasMore}
          next={() => setPage((prev) => prev + 1)}
        >
          <div className="h-10" />
        </InfiniteScroll>
      )}

      <ScrollButton />
    </div>
  );
}
