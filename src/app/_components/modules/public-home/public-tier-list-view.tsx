"use client";

import {
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
} from "../../../../server/api/modules/item/types";
import type { CollectionType } from "../../../../server/api/modules/collection/types";
import { TierListSortSelect } from "../tierlist/tierlist-sort-select";
import { TierListItem } from "../tierlist/tierlist-item";
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
  useGetPublicAllUserItems,
  useGetPublicYearsRange,
  useParseFiltering,
} from "../../../../hooks";
import type { TierItemView } from "../../../../types/tier-item-view.type";
import { TIER_ROWS, TIER_LABELS } from "../../../../constants";
import { Header, Paragraph } from "../../ui";

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

export function PublicTierListView(props: Props) {
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
  const itemView: TierItemView = "hover";

  const { tierItems, isLoading } = useGetPublicAllUserItems({
    collectionsIds,
    filtering,
    sorting,
    search: searchFilter,
  });

  const { fieldGroups } = useGetPublicFilterFields({ collectionsIds });
  const { yearsRange } = useGetPublicYearsRange({ collectionsIds });

  const {
    filterRates,
    setFilterRates,
    filterYears,
    setFilterYears,
  } = useParseFiltering({ filtering, setFiltering, yearsRange });

  const RATED_TIER_ROWS = useMemo(
    () => TIER_ROWS.filter((rate) => rate !== 0),
    [],
  );

  const ratedTierItems = useMemo(() => {
    return tierItems.filter((item) => item.rate !== null && item.rate !== 0);
  }, [tierItems]);

  const tierItemsMap = useMemo(() => {
    const map = new Map<number, typeof tierItems>();
    RATED_TIER_ROWS.forEach((rate) => {
      map.set(rate, []);
    });
    ratedTierItems.forEach((item) => {
      const rate = item.rate ?? 0;
      if (rate !== 0) {
        const items = map.get(rate) ?? [];
        items.push(item);
        map.set(rate, items);
      }
    });
    return map;
  }, [ratedTierItems, RATED_TIER_ROWS]);


  const handleSearchSubmit = () => {
    setSearchFilter(searchQuery.toLowerCase().trim());
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
        <TierListSortSelect sorting={sorting} setSorting={setSorting} />
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
      <Search
        query={searchQuery}
        setQuery={setSearchQuery}
        isLoading={isLoading}
        submit={handleSearchSubmit}
      />

      {/* Filter Badges */}
      <FilterBadges filtering={filtering} setFiltering={setFiltering} />

      {/* Tier List */}
      {isLoading && <Loading />}

      {!isLoading && tierItems.length === 0 && <NoItemsCard />}

      {!isLoading &&
        RATED_TIER_ROWS.map((rate) => {
          const items = tierItemsMap.get(rate) ?? [];
          const tierLabel = TIER_LABELS[rate];

          return (
            <div
              key={rate}
              className="flex min-h-[140px] flex-col gap-4 rounded-lg border-2 border-border bg-card"
            >
              <div className="flex items-center gap-2 rounded-t-lg px-6 py-4">
                <Header vtag="h5" className="font-semibold">
                  {tierLabel}
                </Header>
                <Paragraph className="text-primary-foreground/80">
                  ({items.length} items)
                </Paragraph>
              </div>

              {items.length > 0 ? (
                <div className="flex flex-wrap gap-2 px-4 pb-4">
                  {items.map((item) => (
                    <TierListItem
                      key={item.id}
                      item={item}
                      itemView={itemView}
                      readOnly={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center px-4 pb-8 pt-4">
                  <Paragraph className="text-muted-foreground">
                    No items in this tier
                  </Paragraph>
                </div>
              )}
            </div>
          );
        })}

      <ScrollButton />
    </div>
  );
}
