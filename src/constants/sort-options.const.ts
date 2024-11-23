import { GetUserItemsSortType } from "../server/api/modules/item/types";

export const SORT_OPTIONS: GetUserItemsSortType[] = [
  { type: "asc", name: "date" },
  { type: "desc", name: "date" },
  { type: "asc", name: "status" },
  { type: "desc", name: "status" },
  { type: "asc", name: "year" },
  { type: "desc", name: "year" },
  { type: "asc", name: "rate" },
  { type: "desc", name: "rate" },
];
