import type { CollectionType } from "../../collection/types";

export type TagType = {
  id: string;
  name: string;
  collections: CollectionType[];
  _count: {
    userToItems: number;
  };
};
