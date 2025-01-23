import { api, HydrateClient } from "../../../../trpc/server";
import { BackgroundImage } from "../../../_components/shared";
import { ProfileContainer } from "../../../_components/modules";

export default async function Profile() {
  void api.item.getUserItemsStats.prefetch();
  return (
    <HydrateClient>
      <BackgroundImage image="/posters6.webp">
        <ProfileContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
