"use client";
import { CldImage } from "next-cloudinary";
import { cn } from "../../../lib";
import { env } from "../../../env";

type Props = {
  publicId: string;
  folder: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function CloudinaryImage(props: Props) {
  const { publicId, folder, className, height, width } = props;
  const projectFolder = env.NEXT_PUBLIC_CLOUDINARY_FOLDER;
  const src = `${projectFolder}/${folder}/${publicId}`;
  return (
    <CldImage
      loading="lazy"
      alt={`cover ${publicId}`}
      src={src}
      width={width ?? 200}
      height={height ?? 300}
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
