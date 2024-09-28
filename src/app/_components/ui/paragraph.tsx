import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib/utils";

const paragraphVariants = cva("font-sans leading-relaxed", {
  variants: {
    vsize: {
      lg: "text-lg font-medium ",
      base: "text-base font-normal tracking-wide",
      sm: "text-sm font-normal tracking-wider",
    },
  },
  defaultVariants: {
    vsize: "base",
  },
});

type Props = ComponentPropsWithoutRef<"p"> &
  VariantProps<typeof paragraphVariants>;

const Paragraph = forwardRef<HTMLParagraphElement, Props>((props, ref) => {
  const { className, vsize, children, ...restProps } = props;
  return (
    <p
      className={cn(paragraphVariants({ vsize, className }))}
      ref={ref}
      {...restProps}
    >
      {children}
    </p>
  );
});

export { Paragraph, paragraphVariants };
