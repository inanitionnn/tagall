import { api, HydrateClient } from "../../trpc/server";
import { HomeContainer } from "../_components/modules";

export default async function Home() {
  await api.collection.getUserCollections.prefetch();
  await api.item.getUserItems.prefetch();
  await api.item.getYearsRange.prefetch();
  await api.field.getFilterFields.prefetch();
  return (
    <HydrateClient>
      <HomeContainer />
    </HydrateClient>
  );
}
