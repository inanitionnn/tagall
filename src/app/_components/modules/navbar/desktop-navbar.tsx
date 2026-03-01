import { type ComponentPropsWithRef } from "react";
import { cn } from "~/lib";
import { NavbarContent } from "./navbar-content";

type Props = ComponentPropsWithRef<"div">;

const DesktopNavbar = (props: Props) => {
  const { className, ...restProps } = props;
  return (
    <div className={cn("relative h-lvh w-64 overflow-hidden border-r", className)} {...restProps}>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
        style={{ backgroundImage: "url('/halftone.png')", backgroundRepeat: "repeat" }}
      />
      <NavbarContent />
    </div>
  );
};

export { DesktopNavbar };
