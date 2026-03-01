"use client";

import { TagAddModal } from "./tag-add-modal";
import { TagUpdateModal } from "./tag-update-modal";
import { useDebounce, useGetUserTags } from "../../../../hooks";
import { CollectionsTabs, Container } from "../../shared";
import { api } from "../../../../trpc/react";
import { useState } from "react";

function TagContainer() {
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >([]);

  const debouncedCollectionsIds = useDebounce(
    selectedCollectionsIds.length ? selectedCollectionsIds : undefined,
  );

  const { tags } = useGetUserTags({
    collectionsIds: debouncedCollectionsIds,
  });

  return (
    <Container>
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-between gap-4">
        <CollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
          isMany={false}
        />
        <TagAddModal collections={collections} />
      </div>
      <div className="flex flex-col gap-4">
        {tags.map((tag) => (
          <TagUpdateModal key={tag.id} tag={tag} collections={collections} />
        ))}
      </div>
    </Container>
  );
}
export { TagContainer };
