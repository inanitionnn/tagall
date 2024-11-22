"use client";
import { api } from "~/trpc/react";
import { useEffect, useRef, useState } from "react";
import { HomeCollectionsTabs } from "./home-collections-tabs";
import autoAnimate from "@formkit/auto-animate";
import { toast } from "sonner";
import {
  GetUserItemsFilterType,
  GetUserItemsSortType,
  ItemType,
} from "../../../../server/api/modules/item/types";
import { InfiniteScroll } from "../../ui";
import { Loader2 } from "lucide-react";

function HomeContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();
  const [currentCollectionsIds, setCurrentCollectionsIds] = useState<string[]>(
    collections[0]?.id ? [collections[0]?.id] : [],
  );
  const collectionsTabsRef = useRef(null);
  useEffect(() => {
    if (collectionsTabsRef.current) {
      autoAnimate(collectionsTabsRef.current);
    }
  }, [collectionsTabsRef]);

  const {
    data: yearsRangeData,
    error: yearsRangeError,
    refetch: yearRangeRefetch,
  } = api.item.getYearsRange.useQuery(currentCollectionsIds);
  const [yearsRange, setYearsRange] = useState<{
    minYear: number;
    maxYear: number;
  }>({ minYear: 0, maxYear: 0 });
  useEffect(() => {
    if (yearsRangeData) {
      setYearsRange({
        minYear: yearsRangeData.minYear ?? 0,
        maxYear: yearsRangeData.maxYear ?? 0,
      });
    }
  }, [yearsRangeData]);
  useEffect(() => {
    yearRangeRefetch();
  }, [currentCollectionsIds]);

  const [sorting, setSorting] = useState<GetUserItemsSortType>({
    type: "desc",
    name: "date",
  });
  const [filtering, setFiltering] = useState<GetUserItemsFilterType>([]);

  const limit = 1;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<ItemType[]>([]);
  const {
    data: itemsData,
    isLoading: itemsLoading,
    error: itemsError,
    refetch: itemsRefetch,
  } = api.item.getUserItems.useQuery({
    limit,
    page,
    collectionsIds: currentCollectionsIds,
    sorting,
    filtering,
  });

  useEffect(() => {
    if (itemsData) {
      if (itemsData.length < limit) {
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
    if (hasMore) {
      itemsRefetch();
    }
  }, [page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [currentCollectionsIds, filtering, sorting]);

  useEffect(() => {
    if (itemsError) {
      toast.error(itemsError.message);
    }
    if (yearsRangeError) {
      toast.error(yearsRangeError.message);
    }
  }, [itemsError, yearsRangeError]);

  return (
    <div className="flex flex-col gap-8">
      <HomeCollectionsTabs
        ref={collectionsTabsRef}
        collections={collections}
        currentCollectionsIds={currentCollectionsIds}
        setCurrentCollectionsIds={setCurrentCollectionsIds}
      />

      <p>page: {page}</p>
      <p>hasMore: {hasMore}</p>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div>
            <h1>{item.name}</h1>
            <h2>{item.year}</h2>
            <h3>{item.rate}</h3>
            <h3>{item.status}</h3>
          </div>
        ))}
      </div>
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
