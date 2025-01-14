import React, { type Dispatch, type SetStateAction } from "react";
import { Badge } from "../../ui";
import type { GetUserItemsFilterType } from "../../../../server/api/modules/item/types";
import { STATUS_NAMES } from "../../../../constants";
import type { TagType } from "../../../../server/api/modules/tag/types/tag.type";

type Props = {
  tags: TagType[];
  filtering: GetUserItemsFilterType;
  setFiltering: Dispatch<SetStateAction<GetUserItemsFilterType>>;
  selectedTagsIds: string[];
  setSelectedTagsIds: Dispatch<SetStateAction<string[]>>;
};

const HomeFilterBadges = (props: Props) => {
  const { tags, selectedTagsIds, setSelectedTagsIds, filtering, setFiltering } =
    props;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedTagsIds.map((tagId) => (
        <Badge
          className="cursor-pointer px-2 py-0.5 text-sm hover:bg-destructive"
          key={tagId}
          onClick={() =>
            setSelectedTagsIds((prev) => prev.filter((id) => id !== tagId))
          }
        >
          {tags.find((tag) => tag.id === tagId)?.name}
        </Badge>
      ))}
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
      {[...filtering, ...selectedTagsIds].length > 1 && (
        <Badge
          className="cursor-pointer bg-destructive px-2 py-0.5 text-sm"
          onClick={() => {
            setFiltering([]);
            setSelectedTagsIds([]);
          }}
        >
          Clear
        </Badge>
      )}
    </div>
  );
};

export { HomeFilterBadges };
