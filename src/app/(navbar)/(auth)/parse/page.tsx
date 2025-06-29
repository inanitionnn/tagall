import { api, HydrateClient } from "../../../../trpc/server";
import { BackgroundImage } from "../../../_components/shared";
import { ParseContainer } from "../../../_components/modules";

export default async function Add() {
  void api.collection.getAll.prefetch();
  return (
    <HydrateClient>
      <BackgroundImage image="/posters5.webp">
        <ParseContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
