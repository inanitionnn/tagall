import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui";
import { Ellipsis, LucideIcon } from "lucide-react";
import { forwardRef } from "react";
import { UpdateTagCategoryDrawer } from "./update-tag-category-drawer";
import { DeleteTagCategoryDialog } from "./delete-tag-category-dialog";

type Props = {
  id: string;
  icon: LucideIcon | null;
  name: string | null;
  isAuto: boolean;
  priority: number;
};

const TagCategoryMenu = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant={"ghost"} className="h-8">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        <UpdateTagCategoryDrawer {...props} />
        <DeleteTagCategoryDialog {...props} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export { TagCategoryMenu };
