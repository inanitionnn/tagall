import { Suspense } from "react";
import { api, HydrateClient } from "../../../../trpc/server";
import { TagContainer } from "../../../_components/modules/";
import { BackgroundImage } from "../../../_components/shared";
import LoadingPage from "../../../loading";

export default async function Tag() {
  void api.collection.getAll.prefetch();
  void api.tag.getUserTags.prefetch();
  return (
    <HydrateClient>
      <BackgroundImage image="/posters2.webp">
        <Suspense fallback={<LoadingPage />}>
          <TagContainer />
        </Suspense>
      </BackgroundImage>
    </HydrateClient>
  );
}
