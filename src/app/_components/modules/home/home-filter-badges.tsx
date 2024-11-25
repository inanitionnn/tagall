import React, { Dispatch, SetStateAction } from "react";
import { Badge } from "../../ui";
import { GetUserItemsFilterType } from "../../../../server/api/modules/item/types";
import { STATUS_NAMES } from "../../../../constants";

type Props = {
  filtering: GetUserItemsFilterType;
  setFiltering: Dispatch<SetStateAction<GetUserItemsFilterType>>;
};

const HomeFilterBadges = (props: Props) => {
  const { filtering, setFiltering } = props;

  return (
    <div className="flex flex-wrap gap-2">
      {filtering.map((filter, index) => {
        let badgeText: string = "";
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
          case "field":
            badgeText =
              filter.type === "include"
                ? `+ ${filter.value}`
                : `- ${filter.value}`;
            break;
        }

        return (
          <Badge
            className="cursor-pointer px-2 py-0.5 text-sm hover:bg-destructive"
            key={index}
            onClick={() =>
              setFiltering((prev) =>
                prev.filter(
                  (f) =>
                    f.name !== filter.name ||
                    f.type !== filter.type ||
                    f.value !== filter.value,
                ),
              )
            }
          >
            {badgeText}
          </Badge>
        );
      })}
      {filtering.length > 1 && (
        <Badge
          className="cursor-pointer bg-destructive px-2 py-0.5 text-sm"
          onClick={() => setFiltering([])}
        >
          Clear
        </Badge>
      )}
    </div>
  );
};

export { HomeFilterBadges };
