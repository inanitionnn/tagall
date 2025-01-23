import { api, HydrateClient } from "../../../../../trpc/server";
import { ItemContainer } from "../../../../_components/modules";
import { BackgroundImage } from "../../../../_components/shared";

export default async function Item({ params }: { params: { itemId: string } }) {
  const { itemId } = params;
  void api.item.getUserItem.prefetch(itemId);
  void api.tag.getUserTags.prefetch();

  return (
    <HydrateClient>
      <BackgroundImage image="/posters9.webp">
        <ItemContainer itemId={itemId} />
      </BackgroundImage>
    </HydrateClient>
  );
}
