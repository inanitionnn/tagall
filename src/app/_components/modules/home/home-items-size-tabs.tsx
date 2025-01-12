import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../../ui";
import { Grid2x2, Grid3x3, Rows3, TableProperties } from "lucide-react";
import Container from "../../shared/container";

type Props = {
  itemsSize: "medium" | "list" | "small" | "large";
  setItemsSize: Dispatch<SetStateAction<"medium" | "list" | "small" | "large">>;
};

const HomeItemsSizeTabs = (props: Props) => {
  const { itemsSize, setItemsSize } = props;
  return (
    <Container>
      <Button
        onClick={() => setItemsSize("medium")}
        size={"icon"}
        variant={itemsSize === "medium" ? "default" : "ghost"}
      >
        <Grid3x3 />
      </Button>
      <Button
        onClick={() => setItemsSize("large")}
        size={"icon"}
        variant={itemsSize === "large" ? "default" : "ghost"}
      >
        <Grid2x2 />
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
