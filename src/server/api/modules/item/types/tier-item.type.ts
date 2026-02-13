import { type ItemStatus } from "@prisma/client";

export type TierItemType = {
  id: string;
  title: string;
  year: number | null;
  image: string | null;
  rate: number | null;
  status: ItemStatus;
  collection: {
    id: string;
    name: string;
  };
};
