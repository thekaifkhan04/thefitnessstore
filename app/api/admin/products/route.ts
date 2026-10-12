import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const productSchema = z.object({
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

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const query = searchParams.get("q")?.trim();

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { sku: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const json = await req.json();
    const data = productSchema.parse(json);

    // Ensure slug uniqueness
    let slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
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
        seoTitle: data.seoTitle || `${data.name} | THE FITNESS STORE`,
        seoDescription: data.seoDescription || data.shortDescription,
        images: {
          create: (data.images || []).map((url, idx) => ({
            url,
            alt: data.name,
            displayOrder: idx,
          })),
        },
        variants: {
          create: (data.variants || []).map((v) => ({
            name: v.name,
            size: v.size,
            weight: v.weight,
            color: v.color,
            sku: v.sku,
            pricePaise: v.pricePaise || data.sellingPricePaise,
            stock: v.stock,
          })),
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Create product failed", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
