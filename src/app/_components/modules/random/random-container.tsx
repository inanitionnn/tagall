"use client";
import { useState } from "react";
import {
  CardContainer,
  CollectionsTabs,
  Container,
  FilterDialog,
  Loading,
} from "../../shared";
import { Button, DualRangeSlider, Spinner } from "../../ui";
import { Dices } from "lucide-react";
import { HomeNoItemsCard } from "../home/home-no-items-card";
import { HomeFilterBadges } from "../home/home-filter-badges";
import {
  useGetFilterFields,
  useGetRandomUserItems,
  useGetUserCollections,
  useGetUserTags,
  useParseFiltering,
  useYearsRange,
} from "../../../../hooks";
import { RandomItem } from "./random-item";

function RandomContainer() {
  const [limit, setLimit] = useState<number>(10);
  const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  } = useGetUserCollections();

  const { tags } = useGetUserTags({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { yearsRange } = useYearsRange({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { filterFieldGroups } = useGetFilterFields({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const {
    filtering,
    filterRates,
    filterYears,
    setFilterRates,
    setFilterYears,
    setFiltering,
  } = useParseFiltering({
    yearsRange,
  });

  const { items, refetch, isLoading } = useGetRandomUserItems({
    collectionsIds: selectedCollectionsIds,
    filtering,
    tagsIds: selectedTagsIds,
    limit,
  });

  if (!collections.length) {
    return (
      <div className="flex h-svh items-center justify-center p-6">
        <HomeNoItemsCard />
      </div>
    );
  }

  return (
    <Container>
      <div className="flex flex-wrap justify-between gap-4">
        <CollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
        />

        <CardContainer className="flex w-80 items-center">
          <DualRangeSlider
            value={[limit]}
            onValueChange={(value) => setLimit(value[0] ?? 10)}
            min={1}
            max={20}
            label={(value) => value}
            labelPosition="bottom"
            step={1}
          />
        </CardContainer>

        <FilterDialog
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
        <CardContainer className="w-32">
          <Button onClick={() => refetch()} className="w-full">
            {isLoading ? (
              <Spinner className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Dices />
            )}
          </Button>
        </CardContainer>
      </div>

      <HomeFilterBadges
        tags={tags}
        selectedTagsIds={selectedTagsIds}
        setSelectedTagsIds={setSelectedTagsIds}
        filtering={filtering}
        setFiltering={setFiltering}
      />

      {!isLoading ? (
        <div className="mx-auto grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <RandomItem item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </Container>
  );
}
export { RandomContainer };
