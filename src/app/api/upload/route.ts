import { NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { image, folder } = body;
      if (!image) {
        return NextResponse.json({ error: "No image provided" }, { status: 400 });
      }
      const url = await uploadImageToCloudinary(image, folder || "rent-a-ride/cars");
      return NextResponse.json({ success: true, url });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

      const url = await uploadImageToCloudinary(base64, "rent-a-ride/cars");
      return NextResponse.json({ success: true, url });
    }

    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
