import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../../ui";
import {
  Grid2x2,
  Grid3x3,
  Rows3,
  SquarePen,
  TableProperties,
} from "lucide-react";
import { CardContainer } from "../../shared";

export type ItemsSize = "medium" | "list" | "small" | "large" | "edit";

type Props = {
  itemsSize: ItemsSize;
  setItemsSize: Dispatch<SetStateAction<ItemsSize>>;
};

const HomeItemsSizeTabs = (props: Props) => {
  const { itemsSize, setItemsSize } = props;
  return (
    <CardContainer>
      <Button
        onClick={() => setItemsSize("large")}
        size={"icon"}
        variant={itemsSize === "large" ? "default" : "ghost"}
        className="hidden sm:flex"
      >
        <Grid2x2 />
      </Button>
      <Button
        onClick={() => setItemsSize("medium")}
        size={"icon"}
        variant={itemsSize === "medium" ? "default" : "ghost"}
      >
        <Grid3x3 />
      </Button>
      <Button
        onClick={() => setItemsSize("small")}
        size={"icon"}
        variant={itemsSize === "small" ? "default" : "ghost"}
      >
        <TableProperties className="rotate-180" />
      </Button>
      <Button
        onClick={() => setItemsSize("list")}
        size={"icon"}
        variant={itemsSize === "list" ? "default" : "ghost"}
      >
        <Rows3 />
      </Button>
      <Button
        onClick={() => setItemsSize("edit")}
        size={"icon"}
        variant={itemsSize === "edit" ? "default" : "ghost"}
      >
        <SquarePen />
      </Button>
    </CardContainer>
  );
};

export { HomeItemsSizeTabs };
