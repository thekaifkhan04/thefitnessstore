import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const offerSchema = z.object({
  title: z.string().min(2),
  badge: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  discountPercent: z.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
  bannerImage: z.string().optional().nullable(),
  ctaLabel: z.string().default("SHOP NOW"),
  ctaUrl: z.string().default("/shop"),
});

export async function GET() {
  try {
    await requireAdmin();
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ offers });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const json = await req.json();
    const data = offerSchema.parse(json);

    const offer = await prisma.offer.create({
      data: {
        title: data.title,
        badge: data.badge,
        description: data.description,
        code: data.code,
        discountPercent: data.discountPercent,
        isActive: data.isActive,
        bannerImage: data.bannerImage,
        ctaLabel: data.ctaLabel,
        ctaUrl: data.ctaUrl,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
