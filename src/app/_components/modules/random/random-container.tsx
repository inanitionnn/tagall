"use client";
import { useState } from "react";
import Container from "../../shared/container";
import { Button, DualRangeSlider, Spinner } from "../../ui";
import { Dices } from "lucide-react";
import { HomeNoItemsCard } from "../home/home-no-items-card";
import { CollectionsTabs } from "../../shared/collections-tabs";
import { FilterDialog } from "../../shared/filter-dialog";
import { HomeFilterBadges } from "../home/home-filter-badges";
import Loading from "../../../loading";
import {
  useGetCollections,
  useGetFilterFields,
  useGetRandomUserItems,
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
  } = useGetCollections();

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
  });

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
        <CollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
        />

        <Container className="flex w-80 items-center">
          <DualRangeSlider
            value={[limit]}
            onValueChange={(value) => setLimit(value[0] ?? 10)}
            min={1}
            max={20}
            label={(value) => value}
            labelPosition="bottom"
            step={1}
          />
        </Container>

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
        <Container className="w-32">
          <Button onClick={() => refetch()} className="w-full">
            {isLoading ? (
              <Spinner className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Dices />
            )}
          </Button>
        </Container>
      </div>

      <HomeFilterBadges
        tags={tags}
        selectedTagsIds={selectedTagsIds}
        setSelectedTagsIds={setSelectedTagsIds}
        filtering={filtering}
        setFiltering={setFiltering}
      />

      {!isLoading ? (
        <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((item) => (
            <RandomItem item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
export { RandomContainer };
