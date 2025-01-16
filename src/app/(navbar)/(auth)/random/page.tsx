import { api, HydrateClient } from "../../../../trpc/server";
import { RandomContainer } from "../../../_components/modules";
import BackgroundImage from "../../../_components/shared/background-image";

export const dynamic = "force-dynamic";

export default async function Random() {
  void api.collection.getUserCollections.prefetch();
  void api.item.getRandomUserItems.prefetch();
  void api.item.getYearsRange.prefetch();
  void api.field.getFilterFields.prefetch();
  return (
    <HydrateClient>
      <BackgroundImage image="/posters7.webp">
        <RandomContainer />
      </BackgroundImage>
    </HydrateClient>
  );
}
