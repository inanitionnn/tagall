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
  readOnly?: boolean;
};

const TierListItem = memo((props: Props) => {
  const { item, itemView, readOnly = false } = props;

  const draggableProps = useDraggable({
    id: item.id,
    data: {
      item,
    },
    disabled: readOnly,
  });

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    draggableProps;

  const style = readOnly
    ? {}
    : {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      };

  const itemContent = (
    <>
      {itemView === "poster" && <TierListPosterItem item={item} />}
      {itemView === "hover" && <TierListHoverItem item={item} />}
      {itemView === "title" && <TierListTitleItem item={item} />}
    </>
  );

  if (readOnly) {
    return <div>{itemContent}</div>;
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {itemContent}
    </div>
  );
});

export { TierListItem };
