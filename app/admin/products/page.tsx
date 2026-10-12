import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import { Plus, Search, Edit3, Trash2, ExternalLink, Filter } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

interface AdminProductsProps {
  searchParams: Promise<{ q?: string; categoryId?: string }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsProps) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const query = params.q?.trim();
  const categoryId = params.categoryId;

  const where: any = {};
  if (categoryId) where.categoryId = categoryId;
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { sku: { contains: query, mode: "insensitive" } },
      { brand: { contains: query, mode: "insensitive" } },
    ];
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
      },
    }),
    prisma.category.findMany({ orderBy: { displayOrder: "asc" } }),
  ]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-[#1f1f1f]">
        <div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-neutral-900 dark:text-white">
            PRODUCT MANAGEMENT
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Total {products.length} products listed in catalogue
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-base uppercase tracking-wider text-white transition-all red-glow-subtle flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PRODUCT</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      {/* Search Bar */}
      <form action="/admin/products" method="GET" className="relative w-full">
        {categoryId && <input type="hidden" name="categoryId" value={categoryId} />}
        <input
          type="text"
          name="q"
          defaultValue={query || ""}
          placeholder="Search by name, SKU, or brand..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#2b2b2b] text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
        />
        <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
      </form>

      {/* Categories Filter Strip - Separated with generous bottom padding so scrollbar never overlaps buttons */}
      <div className="pt-1">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-3.5 pt-1 px-1 scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-[#2f2f2f] hover:scrollbar-thumb-neutral-400 dark:hover:scrollbar-thumb-neutral-500 scrollbar-track-transparent flex-nowrap"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <Link
            href="/admin/products"
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
              !categoryId
                ? "bg-[#E31E2F] text-white shadow-sm font-bold"
                : "bg-white dark:bg-[#141414] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-[#242424]"
            }`}
          >
            All Categories ({products.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/admin/products?categoryId=${cat.id}`}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
                categoryId === cat.id
                  ? "bg-[#E31E2F] text-white shadow-sm font-bold"
                  : "bg-white dark:bg-[#141414] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-[#242424]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-[#181818] border-b border-neutral-200 dark:border-[#242424] text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-[#1e1e1e] text-neutral-700 dark:text-neutral-300">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 dark:text-neutral-500">
                    No products found. Click &ldquo;Add New Product&rdquo; to create your first item.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-[#161616] transition-colors">
                    {/* Product Cell */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-[#282828] overflow-hidden shrink-0">
                          {p.images[0]?.url ? (
                            <Image
                              src={p.images[0].url}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 dark:text-white line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-neutral-500 font-mono">
                            {p.sku} {p.brand ? `· ${p.brand}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400 font-medium">
                      {p.category.name}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-display text-sm font-bold text-neutral-900 dark:text-white">
                      {formatINR(p.sellingPricePaise)}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock < 10 ? "text-amber-600 dark:text-amber-400" : "text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.isAvailable
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {p.isAvailable ? "Published" : "Draft"}
                        </span>
                        {p.isFeatured && (
                          <span className="text-[9px] text-[#E31E2F] font-semibold uppercase">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#202020] transition-colors"
                          title="View public product page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#202020] transition-colors"
                          title="Edit product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteProductButton productId={p.id} productName={p.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
