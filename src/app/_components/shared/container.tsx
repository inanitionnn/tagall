import { cn } from "../../../lib";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"div">;

export const Container = (props: Props) => {
  const { className, children, ...restProps } = props;
  return (
    <div
      className={cn(
        "mx-auto flex min-h-lvh max-w-screen-xl flex-col gap-6 p-8",
        "transition-all duration-500 ease-in-out",
        className,
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};
