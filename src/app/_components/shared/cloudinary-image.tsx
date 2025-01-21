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
      loading="lazy"
      alt={`cover ${publicId}`}
      src={publicId}
      width={width ?? 290}
      height={height ?? 400}
      className={cn(
        "aspect-[27/40] rounded-lg border border-input object-cover shadow-sm",
        className,
      )}
      crop={{
        type: "fit",
        source: true,
      }}
    />
  );
}
