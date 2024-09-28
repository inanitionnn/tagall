import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib/utils";

const headerVariants = cva("font-head leading-relaxed", {
  variants: {
    vtag: {
      h1: "text-3xl md:text-4xl xl:text-5xl font-bold tracking-wide",
      h2: "text-3xl md:text-4xl font-bold tracking-wide",
      h3: "text-3xl font-bold tracking-wide",
      h4: "text-2xl font-semibold tracking-wider",
      h5: "text-xl font-semibold tracking-wider",
      h6: "text-lg font-semibold tracking-wider",
    },
  },
  defaultVariants: {
    vtag: "h1",
  },
});

type HeaderTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = ComponentPropsWithoutRef<HeaderTag> &
  VariantProps<typeof headerVariants> & {
    vtag: HeaderTag;
  };

const Header = forwardRef<HTMLHeadingElement, Props>((props, ref) => {
  const { className, children, vtag: Tag = "h1", ...restProps } = props;
  return (
    <Tag
      className={cn(headerVariants({ vtag: Tag, className }))}
      ref={ref}
      {...restProps}
    >
      {children}
    </Tag>
  );
});
export { Header, headerVariants };
