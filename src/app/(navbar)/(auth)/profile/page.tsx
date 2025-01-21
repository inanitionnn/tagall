import { api, HydrateClient } from "../../../../trpc/server";
import BackgroundImage from "../../../_components/shared/background-image";

import { ProfileContainer } from "../../../_components/modules/profile/profile-container";

export default async function Profile() {
  void api.user.getUser.prefetch();
  return (
    <HydrateClient>
      <BackgroundImage image="/posters6.webp">
        <ProfileContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
