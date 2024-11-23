"use client";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { HomeCollectionsTabs } from "./home-collections-tabs";
import { toast } from "sonner";
import {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  ItemType,
} from "../../../../server/api/modules/item/types";
import { InfiniteScroll } from "../../ui";
import { Loader2 } from "lucide-react";
import { HomeItemsSizeTabs } from "./home-items-size-tabs";
import { HomeSortSelect } from "./home-sort-select";
import { HomeItems } from "./home-items";

function HomeContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();

  const LIMIT = 26;
  const [itemsSize, setItemsSize] = useState<"small" | "medium" | "list">(
    "small",
  );
  const [sorting, setSorting] = useState<GetUserItemsSortType>({
    type: "desc",
    name: "date",
  });
  const [filtering, setFiltering] = useState<GetUserItemsFilterType>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<ItemType[]>([]);
  const [currentCollectionsIds, setCurrentCollectionsIds] = useState<string[]>(
    collections[0]?.id ? [collections[0]?.id] : [],
  );
  const [yearsRange, setYearsRange] = useState<{
    minYear: number;
    maxYear: number;
  }>({ minYear: 0, maxYear: 0 });

  const {
    data: yearsRangeData,
    error: yearsRangeError,
    refetch: yearRangeRefetch,
  } = api.item.getYearsRange.useQuery(currentCollectionsIds);

  const {
    data: itemsData,
    isLoading: itemsLoading,
    error: itemsError,
    refetch: itemsRefetch,
  } = api.item.getUserItems.useQuery({
    limit: LIMIT,
    page,
    collectionsIds: currentCollectionsIds,
    sorting,
    filtering,
  });

  useEffect(() => {
    if (yearsRangeData) {
      setYearsRange({
        minYear: yearsRangeData.minYear ?? 0,
        maxYear: yearsRangeData.maxYear ?? 0,
      });
    }
  }, [yearsRangeData]);

  useEffect(() => {
    if (itemsData) {
      if (itemsData.length < LIMIT) {
        setHasMore(false);
      }
      if (page === 1) {
        setItems(itemsData);
      } else {
        setItems((prev) => [...prev, ...itemsData]);
      }
    }
  }, [itemsData]);

  useEffect(() => {
    if (itemsError) {
      toast.error(itemsError.message);
    }
    if (yearsRangeError) {
      toast.error(yearsRangeError.message);
    }
  }, [itemsError, yearsRangeError]);

  useEffect(() => {
    yearRangeRefetch();
  }, [currentCollectionsIds]);

  useEffect(() => {
    if (hasMore) {
      itemsRefetch();
    }
  }, [page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [currentCollectionsIds, filtering, sorting]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-between gap-6">
        <HomeCollectionsTabs
          collections={collections}
          currentCollectionsIds={currentCollectionsIds}
          setCurrentCollectionsIds={setCurrentCollectionsIds}
        />

        <HomeSortSelect setSorting={setSorting} sorting={sorting} />

        <HomeItemsSizeTabs itemsSize={itemsSize} setItemsSize={setItemsSize} />
      </div>

      <HomeItems items={items} itemsSize={itemsSize} />

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={itemsLoading}
        next={() => setPage((prev) => prev + 1)}
        threshold={1}
      >
        {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
      </InfiniteScroll>
    </div>
  );
}
export { HomeContainer };
