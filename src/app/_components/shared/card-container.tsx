import { cn } from "../../../lib";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"div">;

export const CardContainer = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { className, children, ...restProps } = props;

  return (
    <div
      ref={ref}
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
});

CardContainer.displayName = "CardContainer";
