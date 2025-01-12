import { type ComponentPropsWithRef, forwardRef } from "react";
import { cn } from "~/lib";

type Props = ComponentPropsWithRef<"div">;

const Wrapper = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { className, children, ...restProps } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-col gap-4 rounded-lg border p-6",
        className,
      )}
      {...restProps}
    >
      {children}
    </div>
  );
});

export { Wrapper };
