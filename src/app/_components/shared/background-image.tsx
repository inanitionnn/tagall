import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";

type Props = ComponentPropsWithoutRef<"div"> & { image: string };

export const BackgroundImage = (props: Props) => {
  const { children, image, ...restProps } = props;
  return (
    <div className="relative h-full min-h-[100dvh] w-full">
      {/* Fixed positioned background container */}
      <div className="fixed inset-0 -z-10 h-[100dvh] w-[100dvw] overflow-hidden">
        <Image
          src={image}
          alt="background"
          width={1200}
          height={675}
          className="h-full w-full object-cover object-center opacity-[0.10]"
          priority
          {...restProps}
        />
      </div>

      {/* Content container with proper positioning */}
      <div className="relative z-0 h-full min-h-[100dvh] w-full">
        {children}
      </div>
    </div>
  );
};
