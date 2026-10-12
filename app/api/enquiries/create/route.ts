import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createEnquirySchema = z.object({
  customerName: z.string().max(100).optional(),
  customerPhone: z.string().max(25).optional(),
  customerNote: z.string().max(500).optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      productName: z.string(),
      productSku: z.string().optional(),
      variantName: z.string().optional(),
      quantity: z.number().int().positive().max(100),
      unitPricePaise: z.number().int().nonnegative(),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = createEnquirySchema.parse(json);

    // Generate unique reference e.g. TFS-ENQ-20261012-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `TFS-${dateStr}-${randomSuffix}`;

    // Calculate total
    const totalAmountPaise = data.items.reduce(
      (sum, item) => sum + item.unitPricePaise * item.quantity,
      0
    );

    const enquiry = await prisma.orderEnquiry.create({
      data: {
        reference,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerNote: data.customerNote,
        status: "ENQUIRY_INITIATED",
        totalAmountPaise,
        itemsCount: data.items.reduce((s, i) => s + i.quantity, 0),
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            productSku: item.productSku,
            variantName: item.variantName,
            unitPricePaise: item.unitPricePaise,
            quantity: item.quantity,
            subtotalPaise: item.unitPricePaise * item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      reference: enquiry.reference,
      id: enquiry.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Failed to create enquiry record", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
