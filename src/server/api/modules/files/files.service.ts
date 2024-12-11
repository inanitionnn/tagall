import {
  v2 as cloudinary,
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";
import { env } from "../../../../env";

cloudinary.config({
  secure: true,
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER = "tagall";

export const uploadImageByUrl = async (
  imageUrl: string | null | undefined,
): Promise<UploadApiResponse | null> => {
  if (!imageUrl) {
    return null;
  }
  try {
    return await cloudinary.uploader.upload(imageUrl, {
      folder: CLOUDINARY_FOLDER,
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
  } catch (error) {
    const err = error as UploadApiErrorResponse;
    throw new Error(`Error uploading image: ${err.message}`);
  }
};
