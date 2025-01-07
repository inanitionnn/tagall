import React, { type Dispatch, type SetStateAction } from "react";
import { Button } from "../../ui";
import { Grid2x2, Grid3x3, TableProperties } from "lucide-react";

type Props = {
  itemsSize: "medium" | "list" | "small";
  setItemsSize: Dispatch<SetStateAction<"medium" | "list" | "small">>;
};

const HomeItemsSizeTabs = (props: Props) => {
  const { itemsSize, setItemsSize } = props;
  return (
    <div className="inline-flex w-min items-center justify-center gap-2 rounded-md bg-background p-2 text-muted-foreground shadow">
      <Button
        onClick={() => setItemsSize("small")}
        size={"icon"}
        variant={itemsSize === "small" ? "default" : "ghost"}
      >
        <Grid3x3 />
      </Button>
      <Button
        onClick={() => setItemsSize("medium")}
        size={"icon"}
        variant={itemsSize === "medium" ? "default" : "ghost"}
      >
        <Grid2x2 />
      </Button>
      <Button
        onClick={() => setItemsSize("list")}
        size={"icon"}
        variant={itemsSize === "list" ? "default" : "ghost"}
      >
        <TableProperties className="rotate-180" />
      </Button>
    </div>
  );
};

export { HomeItemsSizeTabs };
