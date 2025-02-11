"use client";

import { TagCollectionsTabs } from "./tag-collections-tabs";
import { TagAddModal } from "./tag-add-modal";
import { TagUpdateModal } from "./tag-update-modal";
import { useDebounce, useGetUserTags } from "../../../../hooks";
import { Container } from "../../shared";
import { api } from "../../../../trpc/react";
import { useState } from "react";

function TagContainer() {
  const [collections] = api.collection.getUserCollections.useSuspenseQuery();

  const [selectedCollectionsIds, setSelectedCollectionsIds] = useState<
    string[]
  >(collections.map((collection) => collection.id));

  const debouncedSelectedCollectionsIds = useDebounce(selectedCollectionsIds);

  const { tags } = useGetUserTags({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  return (
    <Container>
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-between gap-4">
        <TagCollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setSelectedCollectionsIds={setSelectedCollectionsIds}
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
