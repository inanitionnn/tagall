import { type ItemStatus } from "@prisma/client";

export type ItemsType = {
  id: string;
  title: string;
  year: number | null;
  description: string | null;
  image: string | null;
  rate: number | null;
  status: ItemStatus;
  collection: {
    name: string;
  };
  timeAgo: string;
  updatedAt: Date;
  tags: {
    id: string;
    name: string;
  }[];
}[];
