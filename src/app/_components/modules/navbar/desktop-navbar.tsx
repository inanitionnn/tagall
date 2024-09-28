import { type ComponentPropsWithRef } from "react";
import { cn } from "~/lib/utils";
import { NavbarContent } from "./navbar-content";

type Props = ComponentPropsWithRef<"div">;

const DesktopNavbar = (props: Props) => {
  const { className, ...restProps } = props;
  return (
    <div className={cn("h-lvh w-64 border-r", className)} {...restProps}>
      <NavbarContent />
    </div>
  );
};

export { DesktopNavbar };
