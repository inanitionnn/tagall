"use client";
import { cn } from "../../../lib";
import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"div">;

const Container = (props: Props) => {
  const { className, children, ...restProps } = props;
  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg border border-input bg-background p-2 shadow focus:border-primary",
        "transition-all duration-500 ease-in-out",
        className,
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default Container;
