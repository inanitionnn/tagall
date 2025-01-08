"use client";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { HomeCollectionsTabs } from "./home-collections-tabs";
import type { GetUserItemsSortType } from "../../../../server/api/modules/item/types";
import { Header, InfiniteScroll, Spinner } from "../../ui";
import { HomeItemsSizeTabs } from "./home-items-size-tabs";
import { HomeSortSelect } from "./home-sort-select";
import { HomeItems } from "./home-items";
import { useYearsRange } from "./hooks/use-get-years-range.hook";
import { useGetUserItems } from "./hooks/use-get-user-items.hook";
import { HomeFilterDialog } from "./home-filter-dialog";
import { useGetFilterFields } from "./hooks/use-get-filter-fields.hook";
import { useItemFilter } from "./hooks/use-item-filter.hook";
import { useDebounce } from "../../../../hooks";
import { HomeFilterBadges } from "./home-filter-badges";
import { HomeNoItemsCard } from "./home-no-items-card";
import { HomeSearch } from "./home-search";

function HomeContainer() {
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const LIMIT = 26;
  const DEBOUNCE = 400;

  const [searchQuery, setSearchQuery] = useState("");
  const [itemsSize, setItemsSize] = useState<"small" | "medium" | "list">(
    "small",
  );
  const [sorting, setSorting] = useState<GetUserItemsSortType>({
    type: "desc",
    name: "date",
  });

  const [currentCollectionsIds, setCurrentCollectionsIds] = useState<string[]>(
    collections.map((collection) => collection.id),
  );

  const debouncedCollectionsIds = useDebounce<string[]>(
    currentCollectionsIds,
    DEBOUNCE,
  );

  const [searchFilter, setSearchFilter] = useState<string>("");

  const { yearsRange } = useYearsRange({
    collectionsIds: debouncedCollectionsIds,
  });

  const {
    filtering,
    filterRates,
    filterYears,
    setFilterRates,
    setFilterYears,
    setFiltering,
  } = useItemFilter({
    yearsRange,
  });

  const debounce = useDebounce(
    { currentCollectionsIds, filtering, sorting, searchQuery },
    DEBOUNCE,
  );

  const { items, setPage, hasMore, isLoading, resetPagination } =
    useGetUserItems({
      limit: LIMIT,
      collectionsIds: debounce.currentCollectionsIds,
      sorting: debounce.sorting,
      filtering: debounce.filtering,
      searchQuery: debounce.searchQuery,
    });

  const { filterFieldGroups } = useGetFilterFields({
    collectionsIds: debouncedCollectionsIds,
  });

  useEffect(() => {
    resetPagination();
  }, [debounce, resetPagination]);

  if (!collections.length) {
    return (
      <div className="flex h-svh items-center justify-center p-6">
        <HomeNoItemsCard />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-between gap-4">
        <HomeCollectionsTabs
          collections={collections}
          currentCollectionsIds={currentCollectionsIds}
          setCurrentCollectionsIds={setCurrentCollectionsIds}
        />

        <HomeSortSelect setSorting={setSorting} sorting={sorting} />

        <HomeItemsSizeTabs itemsSize={itemsSize} setItemsSize={setItemsSize} />

        <HomeFilterDialog
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

      <HomeSearch
        isLoading={isLoading}
        query={searchQuery}
        setQuery={setSearchQuery}
      />

      <HomeFilterBadges filtering={filtering} setFiltering={setFiltering} />

      <HomeItems items={items} itemsSize={itemsSize} />

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={isLoading}
        next={() => setPage((prev) => prev + 1)}
        threshold={1}
      >
        {hasMore && (
          <div className="flex w-full items-center justify-center gap-6">
            <Spinner size={"medium"} />
            <Header vtag="h5">loading</Header>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
export { HomeContainer };
