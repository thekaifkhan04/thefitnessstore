import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import {
  Package,
  Layers,
  Flame,
  AlertTriangle,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Calculate real database metrics
  const [
    totalProducts,
    publishedProducts,
    unavailableProducts,
    lowStockProducts,
    totalCategories,
    activeOffers,
    totalEnquiries,
    recentProducts,
    recentEnquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.product.count({ where: { isAvailable: false } }),
    prisma.product.count({ where: { stock: { lt: 10 } } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.offer.count({ where: { isActive: true } }),
    prisma.orderEnquiry.count(),
    prisma.product.findMany({
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    }),
    prisma.orderEnquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f]">
        <div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Welcome back, <span className="text-white font-semibold">{session.name}</span>. Here is your live inventory status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-base uppercase tracking-wider text-white transition-all red-glow-subtle flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>NEW PRODUCT</span>
          </Link>
          <Link
            href="/admin/settings"
            className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2b2b2b] text-neutral-400 hover:text-white transition-colors"
            title="Store Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Database Derived Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] border-l-4 border-l-emerald-500">
          <div className="text-xs text-neutral-400 uppercase tracking-wider">Published</div>
          <div className="font-display text-3xl font-bold text-white mt-1">
            {publishedProducts}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">of {totalProducts} Total</div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] border-l-4 border-l-[#E31E2F]">
          <div className="text-xs text-neutral-400 uppercase tracking-wider">Categories</div>
          <div className="font-display text-3xl font-bold text-white mt-1">
            {totalCategories}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Active Catalogues</div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] border-l-4 border-l-amber-500">
          <div className="text-xs text-neutral-400 uppercase tracking-wider">Low Stock (&lt;10)</div>
          <div className="font-display text-3xl font-bold text-amber-400 mt-1">
            {lowStockProducts}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Needs Attention</div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] border-l-4 border-l-neutral-600">
          <div className="text-xs text-neutral-400 uppercase tracking-wider">Unavailable</div>
          <div className="font-display text-3xl font-bold text-neutral-400 mt-1">
            {unavailableProducts}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Draft / Out of Stock</div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] border-l-4 border-l-rose-500">
          <div className="text-xs text-neutral-400 uppercase tracking-wider">Active Deals</div>
          <div className="font-display text-3xl font-bold text-white mt-1">
            {activeOffers}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Promotions Running</div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#222222] border-l-4 border-l-blue-500">
          <div className="text-xs text-neutral-400 uppercase tracking-wider">WhatsApp Enquiries</div>
          <div className="font-display text-3xl font-bold text-blue-400 mt-1">
            {totalEnquiries}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Logged Inquiries</div>
        </div>
      </div>

      {/* Split Section: Recent Product Updates & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Products (Inspired by RYNOX Admin cards) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl uppercase tracking-wider text-white">
              RECENTLY UPDATED INVENTORY
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#E31E2F] flex items-center gap-1"
            >
              <span>Manage All ({totalProducts})</span> &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentProducts.map((p) => (
              <div
                key={p.id}
                className={`p-5 rounded-2xl bg-[#131313] border border-[#242424] hover:border-[#383838] transition-all flex flex-col justify-between border-l-4 ${
                  p.isFeatured
                    ? "border-l-[#E31E2F]"
                    : p.isAvailable
                    ? "border-l-emerald-500"
                    : "border-l-amber-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      {p.category.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.isAvailable
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                          : "bg-amber-950/60 text-amber-400 border border-amber-800/60"
                      }`}
                    >
                      {p.isAvailable ? "Published" : "Unavailable"}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                    <span className="font-display text-base font-bold text-white">
                      {formatINR(p.sellingPricePaise)}
                    </span>
                    <span>·</span>
                    <span>SKU: {p.sku}</span>
                    <span>·</span>
                    <span className={p.stock < 10 ? "text-amber-400 font-medium" : ""}>
                      Stock: {p.stock}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1e1e1e] mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-neutral-400 hover:text-white font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/product/${p.slug}`}
                      target="_blank"
                      className="text-neutral-500 hover:text-neutral-300"
                    >
                      View page
                    </Link>
                  </div>
                  {p.isFeatured && (
                    <span className="text-[10px] text-[#E31E2F] font-bold uppercase">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: WhatsApp Enquiries Tracker */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl uppercase tracking-wider text-white">
              RECENT ENQUIRIES
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#E31E2F]"
            >
              View All
            </Link>
          </div>

          <div className="rounded-2xl bg-[#121212] border border-[#242424] divide-y divide-[#1e1e1e] overflow-hidden">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No WhatsApp enquiries recorded yet.
              </div>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-[11px]">
                      {enq.reference}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300">
                      {enq.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>
                      {enq.customerName || "Anonymous Shopper"} ({enq.itemsCount} items)
                    </span>
                    <span className="font-display text-sm font-bold text-white">
                      {formatINR(enq.totalAmountPaise)}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(enq.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
