import { api, HydrateClient } from "../../../../trpc/server";
import { BackgroundImage } from "../../../_components/shared";
import {
  ProfileContainer,
  ProfileParamsType,
} from "../../../_components/modules";
import { useGetServerParams } from "../../../../hooks";

export default async function Profile() {
  const params = useGetServerParams<ProfileParamsType>();

  void api.item.getUserItemsStats.prefetch(params.collectionsIds);
  return (
    <HydrateClient>
      <BackgroundImage image="/posters6.webp">
        <ProfileContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
