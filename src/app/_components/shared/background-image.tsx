import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";

type Props = ComponentPropsWithoutRef<"div"> & { image: string };

export const BackgroundImage = (props: Props) => {
  const { children, image, ...restProps } = props;
  return (
    <div className="relative h-full min-h-screen w-full">
      <Image
        src={image}
        alt="background"
        width={1200}
        height={675}
        className="fixed inset-0 -z-10 h-screen w-full object-cover object-center opacity-[0.10]"
        {...restProps}
      />

      {children}
    </div>
  );
};
