import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const updateCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().max(500).optional().nullable(),
  image: z.string().optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;
    const json = await req.json();
    const data = updateCategorySchema.parse(json);

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug.toLowerCase().trim(),
        description: data.description,
        image: data.image,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath(`/shop/${updated.slug}`);
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr);
    }

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Update category failed", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Check if category still contains products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: it currently contains ${productCount} active products. Please reassign or remove these products first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/shop");
    } catch (revalErr) {
      console.warn("Revalidation warning:", revalErr);
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category failed", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
