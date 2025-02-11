import { Suspense } from "react";
import { api, HydrateClient } from "../../../../trpc/server";
import { AddContainer } from "../../../_components/modules";
import { BackgroundImage } from "../../../_components/shared";
import LoadingPage from "../../../loading";

export default async function Add() {
  void api.collection.getAll.prefetch();
  void api.tag.getUserTags.prefetch();

  return (
    <HydrateClient>
      <BackgroundImage image="/posters8.webp">
        <Suspense fallback={<LoadingPage />}>
          <AddContainer />
        </Suspense>
      </BackgroundImage>
    </HydrateClient>
  );
}
