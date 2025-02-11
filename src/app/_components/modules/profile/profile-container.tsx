"use client";
import { api } from "../../../../trpc/react";
import { ProfileUpdateUserModal } from "./profile-update-user-modal";
import { CollectionsTabs, Container, Loading } from "../../shared";
import { useDebounce, useQueryParams } from "../../../../hooks";
import { ProfileStatusStats } from "./profile-status-stats";
import { ProfileRateStats } from "./profile-rate-stats";
import { ProfileDateStats } from "./profile-date-stats";
import { useUserItemsStats } from "../../../../hooks/queries/use-get-user-items-stats.hook";
import { useEffect, useState } from "react";
import { z } from "zod";
import { GetUserItemsStatsInputSchema } from "../../../../server/api/modules/item/schemas";

export const ProfileParamsSchema = z.object({
  collectionsIds: GetUserItemsStatsInputSchema._def.innerType.default([]),
});

export type ProfileParamsType = z.infer<typeof ProfileParamsSchema>;

function ProfileContainer() {
  const [user] = api.user.getUser.useSuspenseQuery();
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const { getParam, setQueryParams } = useQueryParams<ProfileParamsType>({
    schema: ProfileParamsSchema,
    defaultParams: {
      collectionsIds: collections.map((collection) => collection.id),
    },
  });

  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >(getParam("collectionsIds"));

  const debouncedSelectedCollectionsIds = useDebounce(selectedCollectionsIds);

  const debouncedParams = useDebounce({
    collectionsIds: selectedCollectionsIds,
  });

  useEffect(() => {
    if (debouncedParams) {
      setQueryParams(debouncedParams);
    }
  }, [debouncedParams]);

  const { stats, isLoading } = useUserItemsStats({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  return (
    <Container>
      <ProfileUpdateUserModal user={user} />
      <CollectionsTabs
        collections={collections}
        selectedCollectionsIds={selectedCollectionsIds}
        setSelectedCollectionsIds={setSelectedCollectionsIds}
      />
      {!isLoading && stats ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProfileStatusStats all={stats.all} statusStats={stats.status} />
          <ProfileRateStats rateStats={stats.rate} />
          <ProfileDateStats dateStats={stats.date} />
        </div>
      ) : (
        <Loading />
      )}
    </Container>
  );
}
export { ProfileContainer };
