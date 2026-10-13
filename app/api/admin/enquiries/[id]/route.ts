import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const statusSchema = z.object({
  status: z.enum([
    "ENQUIRY_INITIATED",
    "CONTACTED",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ]),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const json = await req.json();
    const { status } = statusSchema.parse(json);

    const updated = await prisma.orderEnquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update enquiry status" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteParams) {
  return PUT(req, context);
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.orderEnquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
