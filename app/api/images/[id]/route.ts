import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: rawId } = await params;
    if (!rawId) {
      return NextResponse.json({ error: "Missing image identifier" }, { status: 400 });
    }

    // Strip optional file extension (e.g. /api/images/cuid123.webp -> cuid123)
    const assetId = rawId.includes(".") ? rawId.slice(0, rawId.lastIndexOf(".")) : rawId;

    // Check If-None-Match ETag header for conditional request (304 Not Modified)
    const clientEtag = req.headers.get("if-none-match");
    const expectedEtag = `"${assetId}"`;

    if (clientEtag === expectedEtag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          "ETag": expectedEtag,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Fetch binary data and MIME type from Neon PostgreSQL
    const asset = await prisma.imageAsset.findUnique({
      where: { id: assetId },
      select: {
        data: true,
        mimeType: true,
        size: true,
      },
    });

    if (!asset || !asset.data) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Return the image binary with long-term caching & security headers
    return new NextResponse(asset.data as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": asset.mimeType || "application/octet-stream",
        "Content-Length": asset.size ? asset.size.toString() : asset.data.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": expectedEtag,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving image asset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
