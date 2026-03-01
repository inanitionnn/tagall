import { cn } from "../../../lib";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { CardContainer } from "./card-container";

type Props = ComponentPropsWithoutRef<"div">;

export const GrainCardContainer = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { className, children, ...restProps } = props;

  return (
    <CardContainer ref={ref} className="relative overflow-hidden p-2 hover:border-primary hover:shadow-md" {...restProps}>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
        style={{ backgroundImage: "url('/halftone.png')", backgroundRepeat: "repeat" }}
      />
      <div className={cn("relative z-10 flex w-full gap-2 p-1", className)}>
        {children}
      </div>
    </CardContainer>
  );
});

GrainCardContainer.displayName = "GrainCardContainer";
