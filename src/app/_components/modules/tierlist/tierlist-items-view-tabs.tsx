"use client";

import { Button } from "../../ui";
import { Image, SquareMousePointer, Type } from "lucide-react";
import { CardContainer } from "../../shared";
import type { TierItemView } from "../../../../types/tier-item-view.type";

type Props = {
  itemView: TierItemView;
  setItemView: (data: TierItemView) => void;
};

const TierListItemsViewTabs = (props: Props) => {
  const { itemView, setItemView } = props;
  
  return (
    <CardContainer>
      <Button
        onClick={() => setItemView("poster")}
        size={"icon"}
        variant={itemView === "poster" ? "default" : "ghost"}
        title="Poster only"
      >
        <Image />
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
    </CardContainer>
  );
};

export { TierListItemsViewTabs };
