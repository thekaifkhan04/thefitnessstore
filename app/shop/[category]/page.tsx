import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { ArrowLeft, Dumbbell } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | THE FITNESS STORE`,
    description: category.description || `Browse quality ${category.name} at THE FITNESS STORE. Order directly on WhatsApp.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      products: {
        where: { isAvailable: true },
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          variants: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-4 flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-wider">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white">Catalogue</Link>
          <span>/</span>
          <span className="text-[#E31E2F] font-semibold">{category.name}</span>
        </div>

        {/* Category Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#171717] via-[#121212] to-[#0c0c0c] border border-[#262626] p-8 sm:p-12 mb-10 overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31E2F] text-white text-[10px] font-bold uppercase tracking-wider">
              <span>CATEGORY CATALOGUE</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                {category.description}
              </p>
            )}
            <div className="pt-2 text-xs text-neutral-400">
              <span>{category.products.length} Products Available</span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {category.products.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] rounded-2xl border border-[#222222] p-8 space-y-4">
            <Dumbbell className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="font-display text-2xl uppercase text-white">
              No products found in this category
            </h3>
            <p className="text-xs text-neutral-400">
              New inventory is arriving shortly. Contact our team on WhatsApp for catalogue updates.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E31E2F] text-white text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {category.products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  sku: p.sku,
                  brand: p.brand,
                  sellingPricePaise: p.sellingPricePaise,
                  originalPricePaise: p.originalPricePaise,
                  isAvailable: p.isAvailable,
                  categoryName: category.name,
                  categorySlug: category.slug,
                  imageUrl: p.images[0]?.url,
                  variantCount: p.variants.length,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
