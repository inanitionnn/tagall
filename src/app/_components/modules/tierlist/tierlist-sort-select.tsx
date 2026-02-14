"use client";

import {
  Paragraph,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../ui";
import { SORT_OPTIONS } from "../../../../constants";
import type { GetUserItemsSortType } from "../../../../server/api/modules/item/types";

type Props = {
  sorting: GetUserItemsSortType;
  setSorting: (data: GetUserItemsSortType) => void;
};

const TierListSortSelect = (props: Props) => {
  const { setSorting, sorting } = props;

  return (
    <Select
      onValueChange={(value) => {
        const selectedOption = SORT_OPTIONS.find(
          (option) => JSON.stringify(option) === value,
        );
        if (selectedOption) {
          setSorting(selectedOption);
        }
      }}
    >
      <SelectTrigger className="h-14 w-32 justify-center gap-2">
        <Paragraph>{sorting.type === "asc" ? "▲" : "▼"}</Paragraph>
        <Paragraph className="capitalize">{sorting.name}</Paragraph>
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem
            key={`${option.type}-${option.name}`}
            value={JSON.stringify(option)}
          >
            <div className="flex gap-2">
              <Paragraph>{option.type === "asc" ? "▲" : "▼"}</Paragraph>
              <Paragraph className="capitalize">{option.name}</Paragraph>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export { TierListSortSelect };
