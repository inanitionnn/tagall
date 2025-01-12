import { api, HydrateClient } from "../../../../trpc/server";
import { TagContainer } from "../../../_components/modules/tag/tag-container";

export default async function Tag() {
  void api.collection.getAll.prefetch();
  void api.tag.getUserTags.prefetch();
  return (
    <HydrateClient>
      <TagContainer />
    </HydrateClient>
  );
}
