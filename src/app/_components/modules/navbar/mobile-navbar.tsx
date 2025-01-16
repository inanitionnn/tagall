import { cn } from "~/lib";
import {
  Button,
  Sheet,
  SheetContent,
  type SheetContentProps,
  SheetTrigger,
} from "../../ui";
import { Menu } from "lucide-react";
import { NavbarContent } from "./navbar-content";

const MobileNavbar = (props: SheetContentProps) => {
  const { className, ...restProps } = props;
  return (
    <Sheet>
      <SheetTrigger asChild className="fixed right-6 top-6 z-50 lg:hidden">
        <Button size={"icon"} variant={"outline"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className={cn("p-0", className)}
        {...restProps}
      >
        <NavbarContent />
      </SheetContent>
    </Sheet>
  );
};

export { MobileNavbar };
