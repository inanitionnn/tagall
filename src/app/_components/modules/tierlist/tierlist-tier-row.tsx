"use client";

import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { TierItemType } from "../../../../server/api/modules/item/types";
import type { TierItemView } from "../../../../types/tier-item-view.type";
import { TierListItem } from "./tierlist-item";
import { Header, Paragraph } from "../../ui";
import { TIER_LABELS } from "../../../../constants";

type Props = {
  rate: number;
  items: TierItemType[];
  itemView: TierItemView;
};

const TierListTierRow = memo((props: Props) => {
  const { rate, items, itemView } = props;

  const { setNodeRef, isOver } = useDroppable({
    id: `tier-${rate}`,
    data: {
      rate,
    },
  });

  const tierLabel = TIER_LABELS[rate];
  const isPool = rate === 0;

  return (
    <div
      ref={setNodeRef}
      className={`
        flex min-h-[140px] flex-col gap-2 rounded-lg border-2 p-4 transition-all
        ${isOver ? "border-primary bg-primary/10" : "border-border bg-card"}
        ${isPool ? "border-dashed" : ""}
      `}
    >
      <div className="flex items-center gap-2">
        <Header
          vtag="h5"
          className={`min-w-[120px] ${isPool ? "text-muted-foreground" : ""}`}
        >
          {tierLabel}
        </Header>
        <Paragraph className="text-muted-foreground">
          ({items.length} items)
        </Paragraph>
      </div>
      
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <TierListItem key={item.id} item={item} itemView={itemView} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <Paragraph className="text-muted-foreground">
            {isPool ? "Drag unrated items here" : "No items in this tier"}
          </Paragraph>
        </div>
      )}
    </div>
  );
});

export { TierListTierRow };
