import { type ComponentPropsWithRef, forwardRef } from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/lib";

const paragraphVariants = cva("font-sans leading-relaxed", {
  variants: {
    vsize: {
      lg: "text-lg ",
      base: "text-base tracking-wide",
      sm: "text-sm tracking-wider",
    },
  },
  defaultVariants: {
    vsize: "base",
  },
});

type Props = ComponentPropsWithRef<"p"> &
  VariantProps<typeof paragraphVariants>;

const Paragraph = forwardRef<HTMLParagraphElement, Props>((props, ref) => {
  const { className, vsize, children, ...restProps } = props;
  return (
    <p
      ref={ref}
      className={cn(paragraphVariants({ vsize, className }))}
      {...restProps}
    >
      {children}
    </p>
  );
});

export { Paragraph, paragraphVariants };
