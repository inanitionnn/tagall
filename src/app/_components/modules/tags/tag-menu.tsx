"use client";
import { useState } from "react";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui";
import { DeleteTagDialog } from "./delete-tag-dialog";
import { UpdateTagDrawer } from "./update-tag-drawer";

type Props = {
  id: string;
  name: string | null;
};

const TagMenu = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Badge
          variant={isOpen ? "default" : "outline"}
          className="h-10 rounded-md hover:cursor-pointer hover:bg-accent hover:text-accent-foreground"
        >
          {props.name}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col">
        <UpdateTagDrawer {...props} />
        <DeleteTagDialog {...props} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { TagMenu };
