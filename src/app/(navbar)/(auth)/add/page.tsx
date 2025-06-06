import { api, HydrateClient } from "../../../../trpc/server";
import { AddContainer } from "../../../_components/modules";
import { BackgroundImage } from "../../../_components/shared";

export default async function Add() {
  void api.collection.getAll.prefetch();
  void api.tag.getUserTags.prefetch();

  return (
    <HydrateClient>
      <BackgroundImage image="/posters8.webp">
        <AddContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
