import React, { Dispatch, SetStateAction } from "react";
import {
  Paragraph,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../../ui";
import { SORT_OPTIONS } from "../../../../constants";

type Props = {
  sorting: {
    name: "status" | "date" | "rate" | "year";
    type: "desc" | "asc";
  };
  setSorting: Dispatch<
    SetStateAction<{
      name: "status" | "date" | "rate" | "year";
      type: "desc" | "asc";
    }>
  >;
};

const HomeSortSelect = (props: Props) => {
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
      <SelectTrigger className="h-14 w-[180px] shadow">
        <div className="flex gap-2">
          <Paragraph>{sorting.type === "asc" ? "▲" : "▼"}</Paragraph>
          <Paragraph className="capitalize">{sorting.name}</Paragraph>
        </div>
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

export { HomeSortSelect };
