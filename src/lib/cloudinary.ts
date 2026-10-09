import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageToCloudinary(
  fileBufferOrBase64: string,
  folder: string = "rent-a-ride/cars"
): Promise<string> {
  // If Cloudinary keys are configured, upload to Cloudinary
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== "abcdefghijklmnopqrstuvwxyz12345"
  ) {
    try {
      const result = await cloudinary.uploader.upload(fileBufferOrBase64, {
        folder,
        resource_type: "image",
      });
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  }

  // Graceful fallback for local development:
  // If passed an existing URL or base64, return a high-res image
  if (fileBufferOrBase64.startsWith("http://") || fileBufferOrBase64.startsWith("https://")) {
    return fileBufferOrBase64;
  }

  // Fallback curated modern vehicle photo
  return "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";
}

export default cloudinary;
