import { ItemStatus } from "@prisma/client";

export type ItemType = {
  id: string;
  name: string;
  year: number | null;
  description: string | null;
  image: string | null;
  rate: number | null;
  status: ItemStatus;
  collection: string;
  timeAgo: string;
  updatedAt: Date;
  fieldGroups: {
    name: string;
    fields: string[];
  }[];
};
