import React, { type Dispatch, type SetStateAction } from "react";
import { Badge } from "../ui";
import type { GetUserItemsFilterType } from "../../../server/api/modules/item/types";
import { STATUS_NAMES } from "../../../constants";

type Props = {
  filtering: GetUserItemsFilterType;
  setFiltering: Dispatch<SetStateAction<GetUserItemsFilterType>>;
};

const FilterBadges = (props: Props) => {
  const { filtering, setFiltering } = props;

  const removeAllFilters = () => {
    setFiltering([]);
  };

  const removeFilter = (filter: GetUserItemsFilterType[number]) => {
    setFiltering((prev) =>
      prev.filter(
        (f) =>
          f.name !== filter.name ||
          f.type !== filter.type ||
          f.value !== filter.value,
      ),
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filtering.map((filter, index) => {
        let badgeText = "";
        switch (filter.name) {
          case "rate":
          case "year":
            badgeText =
              filter.type === "from"
                ? `> ${filter.value}`
                : `< ${filter.value}`;
            break;
          case "status":
            badgeText =
              filter.type === "include"
                ? `+ ${STATUS_NAMES[filter.value].toLowerCase()}`
                : `- ${STATUS_NAMES[filter.value].toLowerCase()}`;
            break;
          case "tag":
          case "field":
            badgeText =
              filter.type === "include"
                ? `+ ${filter.value}`
                : `- ${filter.value}`;
            break;
        }

        return (
          <Badge
            className="cursor-pointer text-sm hover:bg-destructive"
            key={index}
            onClick={() => removeFilter(filter)}
          >
            {badgeText}
          </Badge>
        );
      })}
      {filtering.length > 0 && (
        <Badge
          className="cursor-pointer bg-destructive text-sm"
          onClick={removeAllFilters}
        >
          Clear
        </Badge>
      )}
    </div>
  );
};

export { FilterBadges };
