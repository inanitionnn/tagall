import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../../ui";
import { Grid2x2, Grid3x3, Rows3, TableProperties } from "lucide-react";
import { Container } from "../../shared";

export type ItemsSize = "medium" | "list" | "small" | "large";

type Props = {
  itemsSize: ItemsSize;
  setItemsSize: Dispatch<SetStateAction<ItemsSize>>;
};

const HomeItemsSizeTabs = (props: Props) => {
  const { itemsSize, setItemsSize } = props;
  return (
    <Container>
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
    </Container>
  );
};

export { HomeItemsSizeTabs };
