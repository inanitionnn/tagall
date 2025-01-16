import type { ComponentPropsWithoutRef } from "react";
import Image from "next/image";

type Props = ComponentPropsWithoutRef<"div"> & { image: string };

const BackgroundImage = (props: Props) => {
  const { children, image, ...restProps } = props;
  return (
    <div className="relative h-full min-h-screen w-full">
      <Image
        src={image}
        alt="background"
        width={1920}
        height={1080}
        objectFit="cover"
        objectPosition="center"
        className="fixed inset-0 -z-10 h-screen w-full object-cover opacity-[0.10]"
        {...restProps}
      />

      {children}
    </div>
  );
};

export default BackgroundImage;
