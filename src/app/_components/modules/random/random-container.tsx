"use client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useGetRandomUserItems } from "./hooks/use-get-random-user-items.hook";
import { useDebounce } from "../../../../hooks";
import { useGetUserTags } from "../tag/hooks/use-get-user-tags.hook";
import Link from "next/link";
import Container from "../../shared/container";
import CloudinaryImage from "../../shared/cloudinary-image";
import { Button, DualRangeSlider, Header, Spinner } from "../../ui";
import { Dices } from "lucide-react";
import { useYearsRange } from "../home/hooks/use-get-years-range.hook";
import { useItemFilter } from "../home/hooks/use-item-filter.hook";
import { useGetFilterFields } from "../home/hooks/use-get-filter-fields.hook";
import { HomeNoItemsCard } from "../home/home-no-items-card";
import { HomeCollectionsTabs } from "../home/home-collections-tabs";
import { HomeFilterDialog } from "../home/home-filter-dialog";
import { HomeFilterBadges } from "../home/home-filter-badges";

function RandomContainer() {
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const DEBOUNCE = 400;

  const [limit, setLimit] = useState<number>(10);

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
      selectedTagsIds,
      limit,
    },
    DEBOUNCE,
  );

  const { items, refetch, isLoading } = useGetRandomUserItems({
    limit: debounce.limit,
    collectionsIds: debounce.selectedCollectionsIds,
    filtering: debounce.filtering,
    tagsIds: debounce.selectedTagsIds,
  });

  const { filterFieldGroups } = useGetFilterFields({
    collectionsIds: debouncedCollectionsIds,
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
        <HomeCollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setselectedCollectionsIds={setselectedCollectionsIds}
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

      <div className="mx-auto grid max-w-screen-2xl grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <Link key={item.id} href={`/item/${item.id}`} target="_blank">
            <Container
              key={item.id}
              className="h-full flex-col hover:scale-105 md:w-full"
            >
              <div className="aspect-[27/40]">
                {item.image ? (
                  <CloudinaryImage publicId={item.image} />
                ) : (
                  <div className="aspect-[27/40] rounded-sm bg-primary object-cover" />
                )}
              </div>
              <div className="flex h-full items-center justify-center p-2">
                <Header vtag="h6" className="line-clamp-3 text-center">
                  {item.title}
                </Header>
              </div>
            </Container>
          </Link>
        ))}
      </div>
    </div>
  );
}
export { RandomContainer };
