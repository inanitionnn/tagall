"use client";

import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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

const ITEM_WIDTHS = {
  poster: 80,
  hover: 80,
  title: 120,
} as const;

const ITEM_GAP = 8; // gap-2 = 8px

const TierListVirtualizedTierRow = memo((props: Props) => {
  const { rate, items, itemView } = props;
  const parentRef = useRef<HTMLDivElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `tier-${rate}`,
    data: {
      rate,
    },
  });

  const tierLabel = TIER_LABELS[rate];
  const isPool = rate === 0;

  // Calculate how many items fit in one row
  const itemWidth = ITEM_WIDTHS[itemView];
  const parentWidth = parentRef.current?.clientWidth ?? 1000;
  const itemsPerRow = Math.max(1, Math.floor(parentWidth / (itemWidth + ITEM_GAP)));

  // Virtualize rows, not individual items
  const rowCount = Math.ceil(items.length / itemsPerRow);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (itemView === "title" ? 210 : 130), // Row height
    overscan: 2,
  });

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
        <div
          ref={parentRef}
          className="relative overflow-auto"
          style={{
            height: "400px",
            maxHeight: "400px",
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const startIdx = virtualRow.index * itemsPerRow;
              const rowItems = items.slice(startIdx, startIdx + itemsPerRow);

              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex flex-wrap gap-2">
                    {rowItems.map((item) => (
                      <TierListItem
                        key={item.id}
                        item={item}
                        itemView={itemView}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
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

export { TierListVirtualizedTierRow };
