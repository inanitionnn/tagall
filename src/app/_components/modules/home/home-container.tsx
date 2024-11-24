"use client";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { HomeCollectionsTabs } from "./home-collections-tabs";
import { GetUserItemsSortType } from "../../../../server/api/modules/item/types";
import { Badge, Header, InfiniteScroll, Spinner } from "../../ui";
import { HomeItemsSizeTabs } from "./home-items-size-tabs";
import { HomeSortSelect } from "./home-sort-select";
import { HomeItems } from "./home-items";
import { useYearsRange } from "./hooks/use-get-years-range.hook";
import { useGetUserItems } from "./hooks/use-get-user-items.hook";
import { HomeFilterDialog } from "./home-filter-dialog";
import { useGetFilterFields } from "./hooks/use-get-filter-fields.hook";
import { useItemFilter } from "./hooks/use-item-filter.hook";

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

  const { items, setPage, hasMore, isLoading, resetPagination } =
    useGetUserItems({
      limit: LIMIT,
      currentCollectionsIds,
      sorting,
      filtering,
    });

  const { filterFieldGroups } = useGetFilterFields({
    currentCollectionsIds,
  });

  useEffect(() => {
    resetPagination();
  }, [currentCollectionsIds, filtering, sorting]);

  return (
    <div className="flex flex-col gap-8">
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
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filtering.map((filter, index) => (
          <Badge
            className="cursor-pointer px-2 py-0.5 text-sm hover:bg-destructive"
            key={index}
            onClick={() =>
              setFiltering((prev) =>
                prev.filter(
                  (f) =>
                    f.name !== filter.name ||
                    f.type !== filter.type ||
                    f.value !== filter.value,
                ),
              )
            }
          >
            {(filter.name === "rate" || filter.name === "year") &&
              (filter.type === "from"
                ? `${filter.name} > ${filter.value}`
                : `${filter.name} < ${filter.value}`)}
            {(filter.name === "status" || filter.name === "field") &&
              (filter.type === "include"
                ? `+${filter.value}`
                : `-${filter.value}`)}
          </Badge>
        ))}
        {filtering.length > 1 && (
          <Badge
            className="cursor-pointer bg-destructive px-2 py-0.5 text-sm"
            onClick={() => setFiltering([])}
          >
            Clear
          </Badge>
        )}
      </div>
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
