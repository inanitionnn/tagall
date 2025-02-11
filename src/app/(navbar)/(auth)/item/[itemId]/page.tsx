import { Suspense } from "react";
import { api, HydrateClient } from "../../../../../trpc/server";
import { ItemContainer } from "../../../../_components/modules";
import { BackgroundImage } from "../../../../_components/shared";
import LoadingPage from "../../../../loading";

export default async function Item({ params }: { params: { itemId: string } }) {
  const { itemId } = params;
  void api.item.getUserItem.prefetch(itemId);
  void api.tag.getUserTags.prefetch();
  void api.field.getItemDetailFields.prefetch(itemId);
  void api.itemComment.getUserItemComment.prefetch(itemId);
  void api.item.getNearestItems.prefetch({
    itemId,
    limit: 8,
  });

  return (
    <HydrateClient>
      <BackgroundImage image="/posters9.webp">
        <Suspense fallback={<LoadingPage />}>
          <ItemContainer itemId={itemId} />
        </Suspense>
      </BackgroundImage>
    </HydrateClient>
  );
}
