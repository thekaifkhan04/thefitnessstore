import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { Prisma } from "@prisma/client";
import {
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  X,
  Layers,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const currentCategorySlug = params.category;
  const currentBrand = params.brand;
  const currentSort = params.sort || "featured";
  const searchQuery = params.q?.trim();
  const page = parseInt(params.page || "1", 10) || 1;
  const pageSize = 12;

  // Build Prisma where clause
  const where: Prisma.ProductWhereInput = {
    isAvailable: true,
  };

  if (currentCategorySlug) {
    where.category = { slug: currentCategorySlug };
  }

  if (currentBrand) {
    where.brand = { equals: currentBrand, mode: "insensitive" };
  }

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { shortDescription: { contains: searchQuery, mode: "insensitive" } },
      { brand: { contains: searchQuery, mode: "insensitive" } },
      { sku: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (params.minPrice) {
    const minPaise = parseInt(params.minPrice, 10) * 100;
    if (!isNaN(minPaise)) {
      where.sellingPricePaise = {
        ...(typeof where.sellingPricePaise === "object" ? where.sellingPricePaise : {}),
        gte: minPaise,
      };
    }
  }

  if (params.maxPrice) {
    const maxPaise = parseInt(params.maxPrice, 10) * 100;
    if (!isNaN(maxPaise)) {
      where.sellingPricePaise = {
        ...(typeof where.sellingPricePaise === "object" ? where.sellingPricePaise : {}),
        lte: maxPaise,
      };
    }
  }

  // Sorting
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (currentSort === "featured") {
    orderBy = { isFeatured: "desc" };
  } else if (currentSort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (currentSort === "price_asc") {
    orderBy = { sellingPricePaise: "asc" };
  } else if (currentSort === "price_desc") {
    orderBy = { sellingPricePaise: "desc" };
  }

  const [products, totalCount, categories, brandRecords] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
        variants: true,
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    }),
  ]);

  const brands = brandRecords
    .map((b) => b.brand)
    .filter((b): b is string => Boolean(b && b.trim()));

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="py-6 border-b border-neutral-200 dark:border-[#1f1f1f] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-[#E31E2F] font-semibold">Catalogue</span>
              {currentCategorySlug && (
                <>
                  <span>/</span>
                  <span className="text-neutral-900 dark:text-white">
                    {categories.find((c) => c.slug === currentCategorySlug)?.name}
                  </span>
                </>
              )}
              {currentBrand && (
                <>
                  <span>/</span>
                  <span className="text-[#E31E2F]">{currentBrand}</span>
                </>
              )}
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white">
              {currentCategorySlug
                ? categories.find((c) => c.slug === currentCategorySlug)?.name || "SHOP CATALOGUE"
                : currentBrand
                ? `${currentBrand} GEAR`
                : "ALL FITNESS GEAR"}
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-1">
              Showing {products.length} of {totalCount} authentic products
            </p>
          </div>

          {/* Quick Search and Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <form action="/shop" method="GET" className="relative">
              {currentCategorySlug && <input type="hidden" name="category" value={currentCategorySlug} />}
              {currentBrand && <input type="hidden" name="brand" value={currentBrand} />}
              <input
                type="text"
                name="q"
                defaultValue={searchQuery || ""}
                placeholder="Search products..."
                className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#2b2b2b] text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F] w-48 sm:w-60 shadow-sm"
              />
              <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-2.5" />
            </form>

            {/* Sort Dropdown Link */}
            <div className="flex items-center gap-1.5 text-xs bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#2b2b2b] rounded-xl px-3 py-2 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-500 dark:text-neutral-400">Sort:</span>
              <div className="flex gap-2">
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentCategorySlug ? { category: currentCategorySlug } : {}),
                    ...(currentBrand ? { brand: currentBrand } : {}),
                    ...(searchQuery ? { q: searchQuery } : {}),
                    sort: "featured",
                  }).toString()}`}
                  className={`hover:text-neutral-900 dark:hover:text-white ${currentSort === "featured" ? "text-[#E31E2F] font-bold" : "text-neutral-500 dark:text-neutral-400"}`}
                >
                  Featured
                </Link>
                <span>·</span>
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentCategorySlug ? { category: currentCategorySlug } : {}),
                    ...(currentBrand ? { brand: currentBrand } : {}),
                    ...(searchQuery ? { q: searchQuery } : {}),
                    sort: "price_asc",
                  }).toString()}`}
                  className={`hover:text-neutral-900 dark:hover:text-white ${currentSort === "price_asc" ? "text-[#E31E2F] font-bold" : "text-neutral-500 dark:text-neutral-400"}`}
                >
                  Price &uarr;
                </Link>
                <span>·</span>
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentCategorySlug ? { category: currentCategorySlug } : {}),
                    ...(currentBrand ? { brand: currentBrand } : {}),
                    ...(searchQuery ? { q: searchQuery } : {}),
                    sort: "price_desc",
                  }).toString()}`}
                  className={`hover:text-neutral-900 dark:hover:text-white ${currentSort === "price_desc" ? "text-[#E31E2F] font-bold" : "text-neutral-500 dark:text-neutral-400"}`}
                >
                  Price &darr;
                </Link>
              </div>
            </div>
          </div>
        </div>



        {/* Active Filters Bar if any filter is chosen */}
        {(currentCategorySlug || currentBrand || searchQuery) && (
          <div className="py-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Active Filters:</span>
            {currentCategorySlug && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#333] text-neutral-800 dark:text-neutral-200 shadow-sm">
                <span>Category: {categories.find((c) => c.slug === currentCategorySlug)?.name}</span>
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentBrand ? { brand: currentBrand } : {}),
                    ...(searchQuery ? { q: searchQuery } : {}),
                  }).toString()}`}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {currentBrand && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#333] text-neutral-800 dark:text-neutral-200 shadow-sm">
                <span>Brand: {currentBrand}</span>
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentCategorySlug ? { category: currentCategorySlug } : {}),
                    ...(searchQuery ? { q: searchQuery } : {}),
                  }).toString()}`}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-[#181818] border border-neutral-200 dark:border-[#333] text-neutral-800 dark:text-neutral-200 shadow-sm">
                <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                <Link
                  href={`/shop?${new URLSearchParams({
                    ...(currentCategorySlug ? { category: currentCategorySlug } : {}),
                    ...(currentBrand ? { brand: currentBrand } : {}),
                  }).toString()}`}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            <Link href="/shop" className="text-xs text-[#E31E2F] hover:underline uppercase tracking-wider ml-2">
              Clear All
            </Link>
          </div>
        )}

        {/* Main Content Layout: Left Sidebar (Categories & Brands) + Right Products Grid */}
        <div className="flex flex-row gap-3 sm:gap-6 py-6 items-start">
          {/* Left Sidebar: Categories & Brands (Always fixed on the left side of the page) */}
          <aside className="w-28 sm:w-52 md:w-60 lg:w-64 shrink-0 space-y-4 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-[#292929] hover:scrollbar-thumb-neutral-400 dark:hover:scrollbar-thumb-neutral-500 scrollbar-track-transparent">
            {/* Filter by Category with Dedicated Vertical Scrollbar */}
            <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#E31E2F]" />
                  <span>CATEGORIES</span>
                </h3>
                <span className="text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden sm:inline">Scrollable</span>
              </div>

              {/* Scrollable list container */}
              <div className="max-h-64 sm:max-h-72 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-[#333] hover:scrollbar-thumb-neutral-400 dark:hover:scrollbar-thumb-neutral-400 scrollbar-track-neutral-100 dark:scrollbar-track-[#151515] rounded-xl p-0.5 sm:p-1">
                <Link
                  href={`/shop${currentBrand ? `?brand=${encodeURIComponent(currentBrand)}` : ""}`}
                  className={`block px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs transition-colors ${
                    !currentCategorySlug
                      ? "bg-[#E31E2F] text-white font-bold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#181818]"
                  }`}
                >
                  All ({totalCount})
                </Link>

                {categories.map((cat) => {
                  const isSelected = currentCategorySlug === cat.slug;
                  return (
                    <Link
                      key={cat.id}
                      href={`/shop?${new URLSearchParams({
                        category: cat.slug,
                        ...(currentBrand ? { brand: currentBrand } : {}),
                      }).toString()}`}
                      className={`flex items-center justify-between px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs transition-colors ${
                        isSelected
                          ? "bg-[#E31E2F] text-white font-bold"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#181818]"
                      }`}
                    >
                      <span className="truncate pr-1">{cat.name}</span>
                      <span className="text-[9px] sm:text-[10px] opacity-75 font-mono shrink-0 hidden sm:inline">
                        {cat._count.products}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Filter by Brand with Dedicated Vertical Scrollbar */}
            {brands.length > 0 && (
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#E31E2F]" />
                    <span>BRANDS</span>
                  </h3>
                  <span className="text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider hidden sm:inline">Scrollable</span>
                </div>

                {/* Scrollable brands container */}
                <div className="max-h-52 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-[#333] hover:scrollbar-thumb-neutral-400 dark:hover:scrollbar-thumb-neutral-400 scrollbar-track-neutral-100 dark:scrollbar-track-[#151515] rounded-xl p-0.5 sm:p-1">
                  <Link
                    href={`/shop${currentCategorySlug ? `?category=${currentCategorySlug}` : ""}`}
                    className={`block px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs transition-colors ${
                      !currentBrand
                        ? "bg-[#E31E2F] text-white font-bold"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#181818]"
                    }`}
                  >
                    All Brands
                  </Link>

                  {brands.map((b) => {
                    const isSelected = currentBrand?.toLowerCase() === b.toLowerCase();
                    return (
                      <Link
                        key={b}
                        href={`/shop?${new URLSearchParams({
                          ...(currentCategorySlug ? { category: currentCategorySlug } : {}),
                          brand: b,
                        }).toString()}`}
                        className={`flex items-center justify-between px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs transition-colors ${
                          isSelected
                            ? "bg-[#E31E2F] text-white font-bold"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#181818]"
                        }`}
                      >
                        <span className="truncate pr-1">{b}</span>
                        {isSelected && <span className="text-[10px] font-bold">&bull;</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: Products Grid Beside Left Sidebar */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Main Product Grid */}
            {products.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] p-8 space-y-4">
                <div className="font-display text-3xl uppercase tracking-wider text-neutral-900 dark:text-white">
                  NO PRODUCTS FOUND
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto">
                  We could not find any products matching your current filters. Try resetting your search or category filter.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-base uppercase tracking-wider text-white transition-colors cursor-pointer shadow-md"
                >
                  RESET FILTERS
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-4">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-8 border-t border-neutral-200 dark:border-[#1f1f1f] flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === page;
                      return (
                        <Link
                          key={pageNum}
                          href={`/shop?${new URLSearchParams({
                            ...(currentCategorySlug ? { category: currentCategorySlug } : {}),
                            ...(currentBrand ? { brand: currentBrand } : {}),
                            ...(searchQuery ? { q: searchQuery } : {}),
                            ...(currentSort ? { sort: currentSort } : {}),
                            page: pageNum.toString(),
                          }).toString()}`}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                            isActive
                              ? "bg-[#E31E2F] text-white shadow-sm"
                              : "bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#262626] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-[#E31E2F]"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
