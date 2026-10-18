import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import path from "path";

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

// Verify magic number / binary header signatures
function validateImageHeader(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8;
  }
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mimeType === "image/gif") {
    return (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    );
  }
  if (mimeType === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  if (mimeType === "image/svg+xml") {
    const text = buffer.toString("utf8").toLowerCase();
    // Verify it looks like SVG and reject dangerous scripts / events
    const hasSvgTag = text.includes("<svg") && text.includes("</svg>");
    const hasScript =
      text.includes("<script") ||
      text.includes("javascript:") ||
      text.includes("onload=") ||
      text.includes("onerror=");
    return hasSvgTag && !hasScript;
  }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate administrator session
    await requireAdmin();

    // 2. Extract uploaded file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 3. Normalize & validate MIME type
    let mimeType = file.type?.toLowerCase();
    if (!mimeType || mimeType === "application/octet-stream") {
      const ext = path.extname(file.name || "").toLowerCase();
      if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
      else if (ext === ".png") mimeType = "image/png";
      else if (ext === ".webp") mimeType = "image/webp";
      else if (ext === ".gif") mimeType = "image/gif";
      else if (ext === ".svg") mimeType = "image/svg+xml";
    }

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          error:
            "Invalid file format. Supported formats: JPG, JPEG, PNG, WEBP, GIF, SVG",
        },
        { status: 400 }
      );
    }

    // 4. Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB size limit. Please upload a smaller image." },
        { status: 400 }
      );
    }

    // 5. Read bytes and validate image signature
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!validateImageHeader(buffer, mimeType)) {
      return NextResponse.json(
        {
          error:
            "File content does not match expected image signature or contains unsafe markup.",
        },
        { status: 400 }
      );
    }

    // 6. Sanitize filename
    const originalName = file.name || "uploaded_image";
    const cleanFilename = originalName
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 100);

    // 7. Store persistently in Neon PostgreSQL using ImageAsset model
    const asset = await prisma.imageAsset.create({
      data: {
        data: buffer,
        mimeType,
        size: buffer.length,
        filename: cleanFilename,
      },
    });

    const publicUrl = `/api/images/${asset.id}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      id: asset.id,
      filename: cleanFilename,
      size: buffer.length,
      mimeType,
    });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
