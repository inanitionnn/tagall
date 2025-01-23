"use client";

import { TagCollectionsTabs } from "./tag-collections-tabs";
import { TagAddModal } from "./tag-add-modal";
import { TagUpdateModal } from "./tag-update-modal";
import { useGetUserCollections, useGetUserTags } from "../../../../hooks";

function TagContainer() {
  const {
    collections,
    selectedCollectionsIds,
    setSelectedCollectionsIds,
    debouncedSelectedCollectionsIds,
  } = useGetUserCollections();

  const { tags } = useGetUserTags({
    collectionsIds: debouncedSelectedCollectionsIds,
  });

  return (
    <div className="flex flex-col gap-6 p-8">
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
    </div>
  );
}
export { TagContainer };
