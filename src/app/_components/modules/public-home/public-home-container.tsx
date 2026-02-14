"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  GetUserItemsFilterType,
  GetUserItemsSortType,
} from "../../../../server/api/modules/item/types";
import { Container, BackgroundImage } from "../../shared";
import { PublicUserHeader } from "./public-user-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui";
import {
  useQueryParams,
  useDebounce,
  useGetPublicUserItemsStats,
} from "../../../../hooks";
import { PublicHomeParamsSchema, type PublicHomeParamsType } from "./schemas";
import { api } from "../../../../trpc/react";
import { Grid3x3, List, Shuffle } from "lucide-react";
import { PublicStandardView } from "./public-standard-view";
import { PublicTierListView } from "./public-tier-list-view";
import { PublicRandomView } from "./public-random-view";

export function PublicHomeContainer() {
  const [user] = api.user.getPublicUser.useSuspenseQuery();
  const [collections] =
    api.collection.getPublicUserCollections.useSuspenseQuery();

  const { getParam, setQueryParams } = useQueryParams<PublicHomeParamsType>({
    schema: PublicHomeParamsSchema,
    defaultParams: {
      filtering: [],
      sorting: { name: "date", type: "desc" },
      viewMode: "standard",
      collectionsIds:
        collections.length > 0 && collections[0] ? [collections[0].id] : [],
    },
  });

  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >(getParam("collectionsIds"));
  const [filtering, setFiltering] = useState<GetUserItemsFilterType>(
    getParam("filtering"),
  );
  const [sorting, setSorting] = useState<GetUserItemsSortType>(
    getParam("sorting"),
  );
  const [viewMode, setViewMode] = useState<"standard" | "tierlist" | "random">(
    getParam("viewMode"),
  );

  // Set first collection as default if none selected
  useEffect(() => {
    if (
      selectedCollectionsIds.length === 0 &&
      collections.length > 0 &&
      collections[0]
    ) {
      const firstCollectionId = collections[0].id;
      setSelectedCollectionsIds([firstCollectionId]);
      setQueryParams({ collectionsIds: [firstCollectionId] });
    }
  }, [collections, selectedCollectionsIds.length, setQueryParams]);

  const debouncedCollectionsIds = useDebounce(selectedCollectionsIds);

  const { stats, isLoading: isStatsLoading } =
    useGetPublicUserItemsStats(debouncedCollectionsIds);

  const handleClearFilters = () => {
    setFiltering([]);
    setQueryParams({ filtering: [] });
  };

  const handleViewModeChange = (mode: string) => {
    const validMode = mode as "standard" | "tierlist" | "random";
    setViewMode(validMode);
    setQueryParams({ viewMode: validMode });
  };

  const backgroundImage = useMemo(() => {
    switch (viewMode) {
      case "standard":
        return "/posters3.webp";
      case "tierlist":
        return "/posters5.webp";
      case "random":
        return "/posters7.webp";
      default:
        return "/posters3.webp";
    }
  }, [viewMode]);

  return (
    <BackgroundImage image={backgroundImage}>
      <Container className="max-w-screen-2xl">
      <div className="flex flex-col gap-4">
        <PublicUserHeader
          user={user}
          stats={stats}
          isStatsLoading={isStatsLoading}
        />

        <Tabs value={viewMode} onValueChange={handleViewModeChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standard" className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Standard</span>
            </TabsTrigger>
            <TabsTrigger value="tierlist" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Tier List</span>
            </TabsTrigger>
            <TabsTrigger value="random" className="flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              <span className="hidden sm:inline">Random</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standard">
            <PublicStandardView
              collections={collections}
              collectionsIds={debouncedCollectionsIds}
              selectedCollectionsIds={selectedCollectionsIds}
              setSelectedCollectionsIds={setSelectedCollectionsIds}
              filtering={filtering}
              setFiltering={setFiltering}
              sorting={sorting}
              setSorting={setSorting}
              handleClearFilters={handleClearFilters}
            />
          </TabsContent>

          <TabsContent value="tierlist">
            <PublicTierListView
              collections={collections}
              collectionsIds={debouncedCollectionsIds}
              selectedCollectionsIds={selectedCollectionsIds}
              setSelectedCollectionsIds={setSelectedCollectionsIds}
              filtering={filtering}
              setFiltering={setFiltering}
              sorting={sorting}
              setSorting={setSorting}
              handleClearFilters={handleClearFilters}
            />
          </TabsContent>

          <TabsContent value="random">
            <PublicRandomView
              collections={collections}
              collectionsIds={debouncedCollectionsIds}
              selectedCollectionsIds={selectedCollectionsIds}
              setSelectedCollectionsIds={setSelectedCollectionsIds}
              filtering={filtering}
              setFiltering={setFiltering}
              sorting={sorting}
              setSorting={setSorting}
              handleClearFilters={handleClearFilters}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
    </BackgroundImage>
  );
}
