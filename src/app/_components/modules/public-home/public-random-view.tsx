"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
} from "../../../../server/api/modules/item/types";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import {
  CardContainer,
  FilterBadges,
  FilterDialog,
  Loading,
  NoItemsCard,
  CollectionsTabs,
} from "../../shared";
import { Button, DualRangeSlider, Spinner } from "../../ui";
import { Dices } from "lucide-react";
import {
  useGetPublicFilterFields,
  useGetPublicRandomUserItems,
  useGetPublicYearsRange,
  useParseFiltering,
} from "../../../../hooks";
import { DEFAULT_RANDOM_LIMIT } from "../../../../constants";
import { HomeMediumItem } from "../home/items-sizes";
import { HomeSortSelect } from "../home/home-sort-select";

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

export function PublicRandomView(props: Props) {
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

  const [limit, setLimit] = useState<number>(DEFAULT_RANDOM_LIMIT);
  const [searchFilter, setSearchFilter] = useState("");

  const { items, refetch, isLoading } = useGetPublicRandomUserItems({
    collectionsIds,
    filtering,
    limit,
  });

  const { fieldGroups } = useGetPublicFilterFields({ collectionsIds });
  const { yearsRange } = useGetPublicYearsRange({ collectionsIds });

  const {
    filterRates,
    setFilterRates,
    filterYears,
    setFilterYears,
  } = useParseFiltering({ filtering, setFiltering, yearsRange });


  const handleLimitChange = (value: number[]) => {
    const newLimit = value[0] ?? DEFAULT_RANDOM_LIMIT;
    setLimit(newLimit);
  };

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
        <CardContainer className="flex h-[50px] w-96 items-center justify-center px-4 pb-5">
          <DualRangeSlider
            value={[limit]}
            onValueChange={handleLimitChange}
            min={1}
            max={20}
            label={(value) => `${value}`}
            labelPosition="bottom"
            step={1}
          />
        </CardContainer>
        <CardContainer className="flex h-[50px] w-24 items-center justify-center">
          <Button onClick={() => refetch()}  className="w-full">
            {isLoading ? (
              <Spinner className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Dices />
            )}
          </Button>
        </CardContainer>
      </div>

      {/* Filter Badges */}
      <FilterBadges filtering={filtering} setFiltering={setFiltering} />

     
   {/* Items */}
      {!isLoading && items.length === 0 && <NoItemsCard />}

      {!isLoading && items.length > 0 && (
        <div className="mx-auto grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {items.map((item) => (
            <div key={item.id} className="pointer-events-none">
              <HomeMediumItem item={item} />
            </div>
          ))}
        </div>
      )}
    
       {isLoading && <Loading />}
    </div>
  );
}
