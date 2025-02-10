import { Button } from "../../ui";
import {
  Grid2x2,
  Grid3x3,
  Rows3,
  SquarePen,
  TableProperties,
} from "lucide-react";
import { CardContainer } from "../../shared";

export type ItemSize = "medium" | "list" | "small" | "large" | "edit";

type Props = {
  itemSize: ItemSize;
  setItemSize: (data: ItemSize) => void;
};

const HomeItemSizeTabs = (props: Props) => {
  const { itemSize, setItemSize } = props;
  return (
    <CardContainer>
      <Button
        onClick={() => setItemSize("large")}
        size={"icon"}
        variant={itemSize === "large" ? "default" : "ghost"}
        className="hidden sm:flex"
      >
        <Grid2x2 />
      </Button>
      <Button
        onClick={() => setItemSize("medium")}
        size={"icon"}
        variant={itemSize === "medium" ? "default" : "ghost"}
      >
        <Grid3x3 />
      </Button>
      <Button
        onClick={() => setItemSize("small")}
        size={"icon"}
        variant={itemSize === "small" ? "default" : "ghost"}
      >
        <TableProperties className="rotate-180" />
      </Button>
      <Button
        onClick={() => setItemSize("list")}
        size={"icon"}
        variant={itemSize === "list" ? "default" : "ghost"}
      >
        <Rows3 />
      </Button>
      <Button
        onClick={() => setItemSize("edit")}
        size={"icon"}
        variant={itemSize === "edit" ? "default" : "ghost"}
      >
        <SquarePen />
      </Button>
    </CardContainer>
  );
};

export { HomeItemSizeTabs };
