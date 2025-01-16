import { type ItemStatus } from "@prisma/client";

export type ItemType = {
  id: string;
  title: string;
  year: number | null;
  description: string | null;
  image: string | null;
  rate: number | null;
  status: ItemStatus;
  collection: {
    id: string;
    name: string;
  };
  timeAgo: string;
  updatedAt: Date;
  fieldGroups: {
    name: string;
    fields: string[];
  }[];
  tags: {
    id: string;
    name: string;
  }[];
  comments: {
    id: string;
    title: string | null;
    description: string | null;
    rate: number | null;
    status: ItemStatus;
    timeAgo: string;
    createdAt: Date;
  }[];
  similarItems: {
    id: string;
    title: string;
    image: string | null;
    year: number | null;
    description: string | null;
    collection: {
      id: string;
      name: string;
    };
  }[];
};
