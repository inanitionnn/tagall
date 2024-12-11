"use client";
import { CldImage } from "next-cloudinary";
import { cn } from "../../../lib";

type Props = {
  publicId: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function CloudinaryImage(props: Props) {
  const { publicId, className, height, width } = props;
  return (
    <CldImage
      alt={`cover ${publicId}`}
      src={publicId}
      width={width ?? 290}
      height={height ?? 400}
      className={cn("aspect-[29/40] rounded-sm object-cover", className)}
      crop={{
        type: "auto",
        source: true,
      }}
    />
  );
}
