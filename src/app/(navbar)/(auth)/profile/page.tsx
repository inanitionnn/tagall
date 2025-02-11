import { api, HydrateClient } from "../../../../trpc/server";
import { BackgroundImage } from "../../../_components/shared";
import {
  ProfileContainer,
  type ProfileParamsType,
} from "../../../_components/modules";
import { useGetServerParams } from "../../../../hooks";
import LoadingPage from "../../../loading";
import { Suspense } from "react";

export default async function Profile() {
  const params = useGetServerParams<ProfileParamsType>();

  void api.item.getUserItemsStats.prefetch(params.collectionsIds);
  return (
    <HydrateClient>
      <BackgroundImage image="/posters6.webp">
        <Suspense fallback={<LoadingPage />}>
          <ProfileContainer />
        </Suspense>
      </BackgroundImage>
    </HydrateClient>
  );
}
