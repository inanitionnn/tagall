"use client";
import { useEffect, useState } from "react";
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
  useDebounce,
  useGetFilterFields,
  useGetRandomUserItems,
  useGetUserCollections,
  useGetUserTags,
  useParseFiltering,
  useQueryParams,
  useYearsRange,
} from "../../../../hooks";
import { RandomItem } from "./random-item";
import { z } from "zod";
import { GetUserItemsInputSchema } from "../../../../server/api/modules/item/schemas";
import { api } from "../../../../trpc/react";
import { GetUserItemsFilterType } from "../../../../server/api/modules/item/types";

const RandomParamsSchema = GetUserItemsInputSchema._def.innerType
  .omit({ limit: true, page: true, search: true, sorting: true })
  .default({});

function RandomContainer() {
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const { getParam, setQueryParams } = useQueryParams<
    z.infer<typeof RandomParamsSchema>
  >({
    schema: RandomParamsSchema,
    defaultParams: {
      filtering: [],
      collectionsIds: collections.map((collection) => collection.id),
    },
  });

  const [limit, setLimit] = useState<number>(10);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const [filtering, setFiltering] = useState<GetUserItemsFilterType>(
    getParam("filtering"),
  );
  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >(getParam("collectionsIds"));

  const debouncedSelectedCollectionsIds = useDebounce(
    selectedCollectionsIds,
    1000,
  );

  const debounceObj = useDebounce(
    {
      collectionsIds: selectedCollectionsIds,
      filtering,
    },
    1000,
  );

  useEffect(() => {
    if (debounceObj) {
      setQueryParams(debounceObj);
    }
  }, [debounceObj]);
  const { tags } = useGetUserTags({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { yearsRange } = useYearsRange({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { fieldGroups } = useGetFilterFields({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  const { filterRates, filterYears, setFilterRates, setFilterYears } =
    useParseFiltering({
      filtering,
      setFiltering,
      yearsRange,
      collectionsIds: debouncedSelectedCollectionsIds,
    });

  const { items, refetch, isLoading } = useGetRandomUserItems({
    collectionsIds: selectedCollectionsIds,
    filtering,
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
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          filterRates={filterRates}
          setFilterRates={setFilterRates}
          filterYears={filterYears}
          setFilterYears={setFilterYears}
          filtering={filtering}
          setFiltering={setFiltering}
          yearsRange={yearsRange}
          fieldGroups={fieldGroups}
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

      <HomeFilterBadges filtering={filtering} setFiltering={setFiltering} />

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
