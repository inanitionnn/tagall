import { api, HydrateClient } from "../../../../../trpc/server";
import { ItemContainer } from "../../../../_components/modules/item/item-container";

export default async function Item({ params }: { params: { itemId: string } }) {
  const { itemId } = params;
  void api.item.getUserItem.prefetch(itemId);
  void api.tag.getUserTags.prefetch();

  return (
    <HydrateClient>
      <ItemContainer itemId={itemId} />
    </HydrateClient>
  );
}
