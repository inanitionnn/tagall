import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui";
import { Ellipsis } from "lucide-react";
import { forwardRef } from "react";

type Props = {
  id: string;
  isAuto: boolean;
  title: string;
  tags: {
    name: string;
    tagCategoryId: string;
    id: string;
    createdAt: Date;
  }[];
  titleIcon: string | null;
  priority: number;
};

const TagCategoryBlock = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {" "}
        <Button size="icon" variant={"ghost"} className="h-8">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export { TagCategoryBlock };
