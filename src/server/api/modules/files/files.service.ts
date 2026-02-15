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
    console.log(`[UploadImageByUrl] No image URL provided, skipping upload`);
    return null;
  }
  
  console.log(`[UploadImageByUrl] Starting to upload image from URL to folder: ${folder}`);
  const startTime = Date.now();
  
  try {
    const response = await cloudinary.uploader.upload(imageUrl, {
      folder: `${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${folder}`,
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      timeout: 120_000, // 2 minutes timeout for image upload
    });
    const imageId = extractId(response.public_id);
    const duration = Date.now() - startTime;
    console.log(`[UploadImageByUrl] Image uploaded successfully to ${folder}, ID: ${imageId} (${duration}ms)`);
    return imageId;
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error as UploadApiErrorResponse;
    console.error(`[UploadImageByUrl] Error uploading image to ${folder} after ${duration}ms:`, err.message);
    throw new Error(`Error uploading image: ${err.message}`);
  }
};

export const UploadImageByBase64 = async (
  folder: string,
  base64Image: string,
): Promise<string | null> => {
  if (!base64Image) {
    console.log(`[UploadImageByBase64] No base64 image provided, skipping upload`);
    return null;
  }
  
  console.log(`[UploadImageByBase64] Starting to upload base64 image to folder: ${folder}`);
  const startTime = Date.now();
  
  try {
    const response = await cloudinary.uploader.upload(base64Image, {
      folder: `${env.NEXT_PUBLIC_CLOUDINARY_FOLDER}/${folder}`,
      transformation: [
        { width: 1000, crop: "scale" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
      timeout: 120_000, // 2 minutes timeout for image upload
    });
    const imageId = extractId(response.public_id);
    const duration = Date.now() - startTime;
    console.log(`[UploadImageByBase64] Image uploaded successfully to ${folder}, ID: ${imageId} (${duration}ms)`);
    return imageId;
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error as UploadApiErrorResponse;
    console.error(`[UploadImageByBase64] Error uploading image to ${folder} after ${duration}ms:`, err.message);
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

export const DeleteFile = async (
  folder: string,
  publicId: string | null | undefined,
): Promise<UploadApiResponse | null> => {
  if (!publicId) {
    return null;
  }
  const baseFolder = env.NEXT_PUBLIC_CLOUDINARY_FOLDER;
  try {
    return await cloudinary.uploader.destroy(
      `${baseFolder}/${folder}/${publicId}`,
    );
  } catch (error) {
    const err = error as UploadApiErrorResponse;
    throw new Error(`Error deleting image: ${err.message}`);
  }
};
