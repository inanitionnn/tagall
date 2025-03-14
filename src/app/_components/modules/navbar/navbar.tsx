import { type ComponentPropsWithRef } from "react";
import { DesktopNavbar } from "./desktop-navbar";
import { cn } from "~/lib";
import { MobileNavbar } from "./mobile-navbar";

type Props = ComponentPropsWithRef<"div">;

export function Navbar(props: Props) {
  const { className, children, ...restProps } = props;
  return (
    <div className={cn("relative flex", className)} {...restProps}>
      <DesktopNavbar className="fixed left-0 top-0 z-10 hidden w-60 bg-background lg:block" />
      <div className="hidden pl-60 lg:block" />
      <MobileNavbar className="w-60 bg-background" />
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
}
