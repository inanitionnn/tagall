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
import { useGetUserTags } from "../tag/hooks/use-get-user-tags.hook";

function HomeContainer() {
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const LIMIT = 30;
  const DEBOUNCE = 400;

  const [searchQuery, setSearchQuery] = useState("");
  const [itemsSize, setItemsSize] = useState<
    "small" | "medium" | "list" | "large"
  >("medium");
  const [sorting, setSorting] = useState<GetUserItemsSortType>({
    type: "desc",
    name: "date",
  });

  const [selectedCollectionsIds, setselectedCollectionsIds] = useState<
    string[]
  >(collections.map((collection) => collection.id));

  const debouncedCollectionsIds = useDebounce<string[]>(
    selectedCollectionsIds,
    DEBOUNCE,
  );

  const { tags } = useGetUserTags({
    collectionsIds: debouncedCollectionsIds,
  });

  const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);

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
    {
      selectedCollectionsIds,
      filtering,
      sorting,
      searchQuery,
      selectedTagsIds,
    },
    DEBOUNCE,
  );

  const { groupedItems, setPage, hasMore, isLoading, resetPagination } =
    useGetUserItems({
      limit: LIMIT,
      collectionsIds: debounce.selectedCollectionsIds,
      sorting: debounce.sorting,
      filtering: debounce.filtering,
      searchQuery: debounce.searchQuery,
      tagsIds: debounce.selectedTagsIds,
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
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 p-8">
      <div className="flex flex-wrap justify-between gap-4">
        <HomeCollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setselectedCollectionsIds={setselectedCollectionsIds}
        />
        <HomeItemsSizeTabs itemsSize={itemsSize} setItemsSize={setItemsSize} />

        <HomeSortSelect setSorting={setSorting} sorting={sorting} />

        <HomeFilterDialog
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

      <HomeSearch
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
    </div>
  );
}
export { HomeContainer };
