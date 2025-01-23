import { type ComponentPropsWithRef, forwardRef } from "react";
import { Header, Spinner } from "../ui";
import { cn } from "../../../lib";

type Props = ComponentPropsWithRef<"div">;

export const Loading = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { className, ...restProps } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-grow items-center justify-center gap-2",
        className,
      )}
      {...restProps}
    >
      <Spinner size="large" />
      <Header vtag="h4">loading</Header>
    </div>
  );
});

Loading.displayName = "Loading";
