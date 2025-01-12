"use client";

import { useState } from "react";
import { useDebounce } from "../../../../hooks";
import { api } from "../../../../trpc/react";
import { TagCollectionsTabs } from "./tag-collections-tabs";
import { TagAddModal } from "./tag-add-modal";
import { TagUpdateModal } from "./tag-update-modal";
import { useGetUserTags } from "./hooks/use-get-user-tags.hook";

function TagContainer() {
  const [collections] = api.collection.getAll.useSuspenseQuery();

  const DEBOUNCE = 200;

  const [selectedCollectionsIds, setselectedCollectionsIds] = useState<
    string[]
  >(collections.map((collection) => collection.id));

  const debouncedCollectionsIds = useDebounce<string[]>(
    selectedCollectionsIds,
    DEBOUNCE,
  );

  const { tags } = useGetUserTags({
    collectionsIds: debouncedCollectionsIds,
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap justify-between gap-4">
        <TagCollectionsTabs
          collections={collections}
          selectedCollectionsIds={selectedCollectionsIds}
          setselectedCollectionsIds={setselectedCollectionsIds}
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
