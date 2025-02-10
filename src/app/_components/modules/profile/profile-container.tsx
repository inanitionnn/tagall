"use client";
import { api } from "../../../../trpc/react";
import { ProfileUpdateUserModal } from "./profile-update-user-modal";
import { CollectionsTabs, Container, Loading } from "../../shared";
import { useGetUserCollections } from "../../../../hooks";
import { ProfileStatusStats } from "./profile-status-stats";
import { ProfileRateStats } from "./profile-rate-stats";
import { ProfileDateStats } from "./profile-date-stats";
import { useUserItemsStats } from "../../../../hooks/queries/use-get-user-items-stats.hook";

function ProfileContainer() {
  const [user] = api.user.getUser.useSuspenseQuery();

  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  } = useGetUserCollections();

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
