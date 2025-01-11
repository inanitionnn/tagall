import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../../ui";
import { Grid2x2, Grid3x3, Rows3, TableProperties } from "lucide-react";

type Props = {
  itemsSize: "medium" | "list" | "small" | "large";
  setItemsSize: Dispatch<SetStateAction<"medium" | "list" | "small" | "large">>;
};

const HomeItemsSizeTabs = (props: Props) => {
  const { itemsSize, setItemsSize } = props;
  return (
    <div className="inline-flex w-min items-center justify-center gap-2 rounded-md bg-background p-2 text-muted-foreground shadow">
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
    </div>
  );
};

export { HomeItemsSizeTabs };
