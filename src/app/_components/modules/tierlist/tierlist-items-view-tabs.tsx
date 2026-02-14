"use client";

import { Button } from "../../ui";
import { Image as ImageIcon, SquareMousePointer, Type } from "lucide-react";
import { CardContainer } from "../../shared";
import type { TierItemView } from "../../../../types/tier-item-view.type";

type Props = {
  itemView: TierItemView;
  setItemView: (data: TierItemView) => void;
  withContainer?: boolean;
};

const TierListItemsViewTabs = (props: Props) => {
  const { itemView, setItemView, withContainer = true } = props;
  
  const buttons = (
    <>
      <Button
        onClick={() => setItemView("poster")}
        size={"icon"}
        variant={itemView === "poster" ? "default" : "ghost"}
        title="Poster only"
      >
        <ImageIcon />
      </Button>
      <Button
        onClick={() => setItemView("hover")}
        size={"icon"}
        variant={itemView === "hover" ? "default" : "ghost"}
        title="Poster with hover"
      >
        <SquareMousePointer />
      </Button>
      <Button
        onClick={() => setItemView("title")}
        size={"icon"}
        variant={itemView === "title" ? "default" : "ghost"}
        title="Poster with title"
      >
        <Type />
      </Button>
    </>
  );

  if (withContainer) {
    return <CardContainer>{buttons}</CardContainer>;
  }

  return <div className="flex gap-2">{buttons}</div>;
};

export { TierListItemsViewTabs };
