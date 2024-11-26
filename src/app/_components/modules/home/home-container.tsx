"use client";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { HomeCollectionsTabs } from "./home-collections-tabs";
import { GetUserItemsSortType } from "../../../../server/api/modules/item/types";
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

function HomeContainer() {
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const LIMIT = 26;

  const [itemsSize, setItemsSize] = useState<"small" | "medium" | "list">(
    "small",
  );
  const [sorting, setSorting] = useState<GetUserItemsSortType>({
    type: "desc",
    name: "date",
  });
  2;
  const [currentCollectionsIds, setCurrentCollectionsIds] = useState<string[]>(
    collections[0]?.id ? [collections[0].id] : [],
  );

  const { yearsRange } = useYearsRange({ currentCollectionsIds });

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

  const debouncedFiltering = useDebounce(filtering, 500);
  const debouncedSorting = useDebounce(sorting, 500);

  const { items, setPage, hasMore, isLoading, resetPagination } =
    useGetUserItems({
      limit: LIMIT,
      currentCollectionsIds,
      sorting: debouncedSorting,
      filtering: debouncedFiltering,
    });

  const { filterFieldGroups } = useGetFilterFields({
    currentCollectionsIds,
  });

  useEffect(() => {
    resetPagination();
  }, [currentCollectionsIds, debouncedFiltering, debouncedSorting]);

  if (!collections.length) {
    return (
      <div className="flex h-svh items-center justify-center p-6">
        <HomeNoItemsCard />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-between gap-6">
        <HomeCollectionsTabs
          collections={collections}
          currentCollectionsIds={currentCollectionsIds}
          setCurrentCollectionsIds={setCurrentCollectionsIds}
        />

        <HomeSortSelect setSorting={setSorting} sorting={sorting} />

        <HomeItemsSizeTabs itemsSize={itemsSize} setItemsSize={setItemsSize} />

        <HomeFilterDialog
          filterRates={filterRates}
          filterYears={filterYears}
          setFilterRates={setFilterRates}
          setFilterYears={setFilterYears}
          yearsRange={yearsRange}
          filterFieldGroups={filterFieldGroups}
          filtering={filtering}
          setFiltering={setFiltering}
        />
      </div>

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
