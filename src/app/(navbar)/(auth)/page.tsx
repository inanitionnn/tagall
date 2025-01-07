import { api, HydrateClient } from '../../../trpc/server';
import { HomeContainer } from '../../_components/modules';

export const dynamic = 'force-dynamic';

export default async function Home() {
  void api.collection.getUserCollections.prefetch();
  void api.item.getUserItems.prefetch();
  void api.item.getYearsRange.prefetch();
  void api.field.getFilterFields.prefetch();
  return (
    <HydrateClient>
      <HomeContainer />
    </HydrateClient>
  );
}
