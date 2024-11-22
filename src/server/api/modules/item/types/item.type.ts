import { ItemStatus } from "@prisma/client";

export type ItemType = {
  id: string;
  name: string;
  year: number | null;
  image: string | null;
  rate: number | null;
  status: ItemStatus;
  fieldGroups: {
    name: string;
    fields: string[];
  }[];
};
