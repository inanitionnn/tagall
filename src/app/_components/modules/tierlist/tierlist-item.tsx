"use client";

import { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { TierItemType } from "../../../../server/api/modules/item/types";
import type { TierItemView } from "../../../../types/tier-item-view.type";
import {
  TierListPosterItem,
  TierListHoverItem,
  TierListTitleItem,
} from "./items-views";

type Props = {
  item: TierItemType;
  itemView: TierItemView;
};

const TierListItem = memo((props: Props) => {
  const { item, itemView } = props;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
      data: {
        item,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {itemView === "poster" && <TierListPosterItem item={item} />}
      {itemView === "hover" && <TierListHoverItem item={item} />}
      {itemView === "title" && <TierListTitleItem item={item} />}
    </div>
  );
});

export { TierListItem };
