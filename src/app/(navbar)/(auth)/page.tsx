import { api, HydrateClient } from "../../../trpc/server";
import { HomeContainer, type HomeParamsType } from "../../_components/modules";
import { BackgroundImage } from "../../_components/shared";
import { useGetServerParams } from "../../../hooks";
import LoadingPage from "../../loading";
import { Suspense } from "react";

export default async function Home() {
  const params = useGetServerParams<HomeParamsType>();

  void api.collection.getUserCollections.prefetch();
  void api.item.getUserItems.prefetch({
    collectionsIds: params.collectionsIds,
    filtering: params.filtering,
    sorting: params.sorting,
  });
  void api.item.getYearsRange.prefetch(params.collectionsIds);
  void api.field.getFilterFields.prefetch(params.collectionsIds);

  return (
    <HydrateClient>
      <BackgroundImage image="/posters3.webp">
        <Suspense fallback={<LoadingPage />}>
          <HomeContainer />
        </Suspense>
      </BackgroundImage>
    </HydrateClient>
  );
}
