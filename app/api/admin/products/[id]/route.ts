import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const updateProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  sku: z.string().min(2).max(50),
  brand: z.string().max(100).optional().nullable(),
  categoryId: z.string(),
  sellingPricePaise: z.number().int().nonnegative(),
  originalPricePaise: z.number().int().nonnegative().optional().nullable(),
  stock: z.number().int().default(0),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isOffer: z.boolean().default(false),
  enquiryType: z.string().default("BOTH"),
  shortDescription: z.string().max(500).optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  specifications: z.string().optional().nullable(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(300).optional().nullable(),
  images: z.array(z.string().min(1)).optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        size: z.string().optional().nullable(),
        weight: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        sku: z.string().optional().nullable(),
        pricePaise: z.number().int().nonnegative().optional().nullable(),
        stock: z.number().int().default(10),
      })
    )
    .optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const json = await req.json();
    const data = updateProductSchema.parse(json);

    // Update product inside transaction
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update product core fields
      const p = await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug.toLowerCase().trim(),
          sku: data.sku.toUpperCase().trim(),
          brand: data.brand,
          categoryId: data.categoryId,
          sellingPricePaise: data.sellingPricePaise,
          originalPricePaise: data.originalPricePaise,
          stock: data.stock,
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
          isNewArrival: data.isNewArrival,
          isOffer: data.isOffer,
          enquiryType: data.enquiryType,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          specifications: data.specifications,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
        },
      });

      // 2. Refresh images if provided
      if (data.images && data.images.length > 0) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: data.images.map((url, idx) => ({
            productId: id,
            url,
            alt: data.name,
            displayOrder: idx,
          })),
        });
      }

      // 3. Refresh variants if provided
      if (data.variants && data.variants.length > 0) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: data.variants.map((v) => ({
            productId: id,
            name: v.name,
            size: v.size,
            weight: v.weight,
            color: v.color,
            sku: v.sku,
            pricePaise: v.pricePaise || data.sellingPricePaise,
            stock: v.stock,
          })),
        });
      }

      return p;
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath(`/product/${updated.slug}`);
      revalidatePath("/offers");
      revalidatePath("/search");
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr);
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Update product failed", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/offers");
      revalidatePath("/search");
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr);
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product failed", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
