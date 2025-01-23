"use client";
import { api } from "../../../../trpc/react";
import { ProfileUpdateUserModal } from "./profile-update-user-modal";
import Loaging from "../../../loading";
import { CollectionsTabs } from "../../shared/collections-tabs";
import { useGetCollections } from "../../../../hooks";
import { ProfileStatusStats } from "./profile-status-stats";
import { ProfileRateStats } from "./profile-rate-stats";
import { ProfileDateStats } from "./profile-date-stats";
import { useUserItemsStats } from "../../../../hooks/use-get-user-items-stats.hook";

function ProfileContainer() {
  const [user] = api.user.getUser.useSuspenseQuery();

  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  } = useGetCollections();

  const { stats } = useUserItemsStats({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6 p-8">
      <ProfileUpdateUserModal user={user} />
      <CollectionsTabs
        collections={collections}
        selectedCollectionsIds={selectedCollectionsIds}
        setSelectedCollectionsIds={setSelectedCollectionsIds}
      />
      {stats ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProfileStatusStats all={stats.all} statusStats={stats.status} />
          <ProfileRateStats rateStats={stats.rate} />
          <ProfileDateStats dateStats={stats.date} />
        </div>
      ) : (
        <Loaging />
      )}
    </div>
  );
}
export { ProfileContainer };
