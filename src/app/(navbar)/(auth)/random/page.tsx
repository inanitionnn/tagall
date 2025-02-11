import { Suspense } from "react";
import { useGetServerParams } from "../../../../hooks";
import { api, HydrateClient } from "../../../../trpc/server";
import {
  RandomContainer,
  type RandomParamsType,
} from "../../../_components/modules";
import { BackgroundImage } from "../../../_components/shared";
import LoadingPage from "../../../loading";

export default async function Random() {
  const params = useGetServerParams<RandomParamsType>();

  void api.collection.getUserCollections.prefetch();
  void api.item.getRandomUserItems.prefetch({
    collectionsIds: params.collectionsIds,
    filtering: params.filtering,
    limit: params.limit,
  });
  void api.item.getYearsRange.prefetch(params.collectionsIds);
  void api.field.getFilterFields.prefetch(params.collectionsIds);
  return (
    <HydrateClient>
      <BackgroundImage image="/posters7.webp">
        <Suspense fallback={<LoadingPage />}>
          <RandomContainer />
        </Suspense>
      </BackgroundImage>
    </HydrateClient>
  );
}
