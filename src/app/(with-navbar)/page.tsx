import { api, HydrateClient } from "../../trpc/server";
import { HomeContainer } from "../_components/modules";

export default async function Home() {
  await api.collection.getAll.prefetch();
  await api.item.getUserItems.prefetch();
  await api.item.getYearsRange.prefetch();
  return (
    <HydrateClient>
      <HomeContainer />
    </HydrateClient>
  );
}
