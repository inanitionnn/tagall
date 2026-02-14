import { api, HydrateClient } from "../../trpc/server";
import { getServerParams } from "../../hooks";
import { PublicHomeContainer } from "../_components/modules/public-home/public-home-container";
import type { PublicHomeParamsType } from "../_components/modules/public-home/schemas";

export default async function PublicHome() {
  const params = getServerParams<PublicHomeParamsType>();

  void api.user.getPublicUser.prefetch();
  void api.collection.getPublicUserCollections.prefetch();
  void api.item.getPublicUserItems.prefetch({
    collectionsIds: params.collectionsIds,
    filtering: params.filtering,
    sorting: params.sorting,
  });
  void api.item.getPublicYearsRange.prefetch(params.collectionsIds);
  void api.field.getPublicFilterFields.prefetch(params.collectionsIds);
  void api.item.getPublicUserItemsStats.prefetch(params.collectionsIds);

  return (
    <HydrateClient>
      <PublicHomeContainer />
    </HydrateClient>
  );
}
