import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib";

const headerVariants = cva("font-head leading-relaxed", {
  variants: {
    vtag: {
      h1: "text-3xl md:text-4xl font-black leading-tight",
      h2: "text-2xl md:text-3xl font-extrabold leading-tight",
      h3: "text-1xl md:text-2xl font-extrabold leading-tight",
      h4: "text-lg md:text-xl font-extrabold leading-tight",
      h5: "text-base md:text-lg font-extrabold leading-tight",
      h6: "text-base font-extrabold leading-tight",
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
      ref={ref}
      className={cn(headerVariants({ vtag: Tag, className }))}
      {...restProps}
    >
      {children}
    </Tag>
  );
});
export { Header, headerVariants };
