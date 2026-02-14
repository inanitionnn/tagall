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
} from "../../shared";
import {
  useGetPublicFilterFields,
  useGetPublicYearsRange,
  useGetPublicUserItems,
  useParseFiltering,
} from "../../../../hooks";
import { HomeMediumItem } from "../home/items-sizes";

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
  } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const { items, setPage, hasMore, isLoading } = useGetPublicUserItems({
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
      {/* Collections + Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
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
      {isLoading && <Loading />}

      {!isLoading && items?.length === 0 && <NoItemsCard />}

      {items && items.length > 0 && (
        <div className="mx-auto grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {items.map((item) => (
            <div key={item.id} className="pointer-events-none">
              <HomeMediumItem item={item} />
            </div>
          ))}
        </div>
      )}

      {hasMore && !isLoading && (
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
