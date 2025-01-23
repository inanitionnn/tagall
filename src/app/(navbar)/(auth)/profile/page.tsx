import { api, HydrateClient } from "../../../../trpc/server";
import { BackgroundImage } from "../../../_components/shared";
import { ProfileContainer } from "../../../_components/modules";

export const dynamic = "force-dynamic";

export default async function Profile() {
  void api.user.getUser.prefetch();
  void api.item.getUserItemsStats.prefetch();
  return (
    <HydrateClient>
      <BackgroundImage image="/posters6.webp">
        <ProfileContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
