import { api, HydrateClient } from "../../../../trpc/server";
import { TagContainer } from "../../../_components/modules/tag/tag-container";
import BackgroundImage from "../../../_components/shared/background-image";

export default async function Tag() {
  void api.collection.getAll.prefetch();
  void api.tag.getUserTags.prefetch();
  return (
    <HydrateClient>
      <BackgroundImage image="/posters2.webp">
        <TagContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
