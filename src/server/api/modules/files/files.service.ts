import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";
import { env } from "../../../../env";

cloudinary.config({
  secure: true,
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

function extractId(input: string | null | undefined): string | null {
  if (!input) return null;
  const regex = /tagall\/\w+\/(\w+)/;
  const match = regex.exec(input)?.at(1);

  return match ?? null;
}

export const UploadImageByUrl = async (
  folder: string,
  imageUrl: string | null | undefined,
): Promise<string | null> => {
  if (!imageUrl) {
    return null;
  }
  try {
    const response = await cloudinary.uploader.upload(imageUrl, {
      folder: `${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${folder}`,
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    return extractId(response.public_id);
  } catch (error) {
    const err = error as UploadApiErrorResponse;
    throw new Error(`Error uploading image: ${err.message}`);
  }
};

export const MoveFile = async (
  fromPublicId: string | null | undefined,
  toPublicId: string,
): Promise<UploadApiResponse | null> => {
  if (!fromPublicId) {
    return null;
  }
  const folder = env.NEXT_PUBLIC_CLOUDINARY_FOLDER;
  try {
    return await cloudinary.uploader.rename(
      `${folder}/${fromPublicId}`,
      `${folder}/${toPublicId}`,
    );
  } catch (error) {
    const err = error as UploadApiErrorResponse;
    throw new Error(`Error moving image: ${err.message}`);
  }
};
