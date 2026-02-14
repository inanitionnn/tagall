import type { GetUserItemsSortType } from "../server/api/modules/item/types";

export const SORT_OPTIONS: GetUserItemsSortType[] = [
  { type: "asc", name: "title" },
  { type: "desc", name: "title" },
  { type: "asc", name: "date" },
  { type: "desc", name: "date" },
  { type: "asc", name: "year" },
  { type: "desc", name: "year" },
];
