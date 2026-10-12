import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { Search, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search gym equipment, supplements, apparel and fitness accessories at THE FITNESS STORE.",
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          isAvailable: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { shortDescription: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { category: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          variants: true,
        },
        take: 24,
      })
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 border-b border-neutral-200 dark:border-[#1f1f1f] space-y-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            <Link href="/" className="hover:text-[#E31E2F]">Home</Link>
            <span>/</span>
            <span className="text-[#E31E2F] font-semibold">Search</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white">
            SEARCH THE CATALOGUE
          </h1>

          {/* Search bar */}
          <form action="/search" method="GET" className="max-w-2xl relative">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by product name, SKU, category (e.g. lever belt, dumbbells, technosport)..."
              autoFocus
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-neutral-100 dark:bg-[#141414] border border-neutral-300 dark:border-[#2d2d2d] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F] shadow-md dark:shadow-lg"
            />
            <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 absolute left-4 top-4.5" />
            <button
              type="submit"
              className="absolute right-3 top-2.5 px-4 py-2 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="py-10">
          {query ? (
            <div className="space-y-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Found <strong>{products.length}</strong> {products.length === 1 ? "result" : "results"} for &ldquo;<span className="text-neutral-900 dark:text-white font-semibold">{query}</span>&rdquo;
              </p>

              {products.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] p-8 space-y-3">
                  <h3 className="font-display text-2xl uppercase text-neutral-900 dark:text-white">
                    NO MATCHING GEAR FOUND
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    Try searching for general keywords like &ldquo;Belt&rdquo;, &ldquo;Shaker&rdquo;, &ldquo;Dumbbell&rdquo;, or browse our full catalogue.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-[#E31E2F] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    View All Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {products.map((p) => (
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
                        categoryName: p.category.name,
                        categorySlug: p.category.slug,
                        imageUrl: p.images[0]?.url,
                        variantCount: p.variants.length,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-500 text-sm">
              Enter a search keyword above to explore the inventory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
