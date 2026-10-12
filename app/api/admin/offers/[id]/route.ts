import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const updateOfferSchema = z.object({
  title: z.string().min(2),
  badge: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  discountPercent: z.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
  ctaLabel: z.string().default("SHOP NOW"),
  ctaUrl: z.string().default("/shop"),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const json = await req.json();
    const data = updateOfferSchema.parse(json);

    const updated = await prisma.offer.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.offer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Offer deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
