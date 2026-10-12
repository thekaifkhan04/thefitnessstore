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
  SlidersHorizontal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Calculate real database metrics (excluding unneeded inventory list)
  const [
    totalProducts,
    publishedProducts,
    unavailableProducts,
    lowStockProducts,
    totalCategories,
    activeOffers,
    totalEnquiries,
    recentEnquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.product.count({ where: { isAvailable: false } }),
    prisma.product.count({ where: { stock: { lt: 10 } } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.offer.count({ where: { isActive: true } }),
    prisma.orderEnquiry.count(),
    prisma.orderEnquiry.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-[#1f1f1f]">
        <div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-neutral-900 dark:text-white">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Welcome back, <span className="text-neutral-900 dark:text-white font-semibold">{session.name}</span>. Real-time store performance & enquiry management.
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
            className="p-2.5 rounded-xl bg-white dark:bg-[#141414] hover:bg-neutral-100 dark:hover:bg-[#1f1f1f] border border-neutral-200 dark:border-[#2b2b2b] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Store Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Database Derived Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] border-l-4 border-l-emerald-500 shadow-sm">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Published</div>
          <div className="font-display text-3xl font-bold text-neutral-900 dark:text-white mt-1">
            {publishedProducts}
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">of {totalProducts} Total</div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] border-l-4 border-l-[#E31E2F] shadow-sm">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Categories</div>
          <div className="font-display text-3xl font-bold text-neutral-900 dark:text-white mt-1">
            {totalCategories}
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Active Catalogues</div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] border-l-4 border-l-amber-500 shadow-sm">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Low Stock (&lt;10)</div>
          <div className="font-display text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {lowStockProducts}
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Needs Attention</div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] border-l-4 border-l-neutral-400 dark:border-l-neutral-600 shadow-sm">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Unavailable</div>
          <div className="font-display text-3xl font-bold text-neutral-600 dark:text-neutral-400 mt-1">
            {unavailableProducts}
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Draft / Out of Stock</div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] border-l-4 border-l-rose-500 shadow-sm">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Active Deals</div>
          <div className="font-display text-3xl font-bold text-neutral-900 dark:text-white mt-1">
            {activeOffers}
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Promotions Running</div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#222222] border-l-4 border-l-blue-500 shadow-sm">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">WhatsApp Enquiries</div>
          <div className="font-display text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {totalEnquiries}
          </div>
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Logged Inquiries</div>
        </div>
      </div>

      {/* Main Section: Quick Management Actions + Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Actions Hub */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl uppercase tracking-wider text-neutral-900 dark:text-white">
              MANAGEMENT SHORTCUTS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Link
              href="/admin/products"
              className="p-4 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] hover:border-[#E31E2F]/60 transition-all group flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-center justify-center text-[#E31E2F]">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-[#1a1a1a] px-2 py-0.5 rounded">
                  {totalProducts}
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold uppercase text-neutral-900 dark:text-white group-hover:text-[#E31E2F] transition-colors">
                  Product Catalogue
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  View, filter, edit & manage all store products.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="p-4 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] hover:border-[#E31E2F]/60 transition-all group flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-[#1a1a1a] px-2 py-0.5 rounded">
                  {totalCategories}
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold uppercase text-neutral-900 dark:text-white group-hover:text-[#E31E2F] transition-colors">
                  Categories
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Organize categories, display order & images.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/offers"
              className="p-4 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] hover:border-[#E31E2F]/60 transition-all group flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-[#1a1a1a] px-2 py-0.5 rounded">
                  {activeOffers}
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold uppercase text-neutral-900 dark:text-white group-hover:text-[#E31E2F] transition-colors">
                  Deals & Offers
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage promotional badges, banners & discounts.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] hover:border-[#E31E2F]/60 transition-all group flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                  Live
                </span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold uppercase text-neutral-900 dark:text-white group-hover:text-[#E31E2F] transition-colors">
                  Store Settings
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Upload logo, change theme color & WhatsApp details.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: WhatsApp Enquiries Tracker */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl uppercase tracking-wider text-neutral-900 dark:text-white">
              RECENT WHATSAPP ENQUIRIES
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-[#E31E2F] flex items-center gap-1"
            >
              <span>View All ({totalEnquiries})</span> &rarr;
            </Link>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] divide-y divide-neutral-200 dark:divide-[#1e1e1e] overflow-hidden shadow-sm">
            {recentEnquiries.length === 0 ? (
              <div className="p-10 text-center text-xs text-neutral-400 dark:text-neutral-500">
                No WhatsApp enquiries recorded yet.
              </div>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 sm:p-5 space-y-2 text-xs hover:bg-neutral-50 dark:hover:bg-[#161616] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white text-[12px]">
                      {enq.reference}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {enq.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
                    <span className="font-medium">
                      {enq.customerName || "Anonymous Customer"} · {enq.itemsCount} item{enq.itemsCount !== 1 ? "s" : ""}
                    </span>
                    <span className="font-display text-base font-bold text-neutral-900 dark:text-white">
                      {formatINR(enq.totalAmountPaise)}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(enq.createdAt).toLocaleString()}
                    </span>
                    <Link
                      href="/admin/orders"
                      className="text-neutral-500 dark:text-neutral-400 hover:text-[#E31E2F] transition-colors font-medium"
                    >
                      Inspect Enquiry &rarr;
                    </Link>
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
