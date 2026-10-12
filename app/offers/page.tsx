import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { Flame, ArrowRight, Tag, Percent } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Special Deals & Promotional Offers",
  description: "Exclusive discounts and bulk pricing promotions at THE FITNESS STORE.",
};

export default async function OffersPage() {
  const [offers, offerProducts] = await Promise.all([
    prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: {
        isAvailable: true,
        OR: [
          { isOffer: true },
          { originalPricePaise: { not: null } },
        ],
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
        variants: true,
      },
      take: 16,
      orderBy: { sellingPricePaise: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 border-b border-neutral-200 dark:border-[#1f1f1f]">
          <div className="inline-flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-[#E31E2F]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
              SPECIAL PROMOTIONS
            </span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-neutral-900 dark:text-white">
            DEALS & FEATURED OFFERS
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
            Take advantage of limited-time discounts and wholesale package deals. All prices verified directly on WhatsApp.
          </p>
        </div>

        {/* Active Promotional Banners */}
        {offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            {offers.map((off) => (
              <div
                key={off.id}
                className="rounded-3xl bg-gradient-to-br from-[#1a0809] to-[#121212] border border-red-900/40 p-8 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  {off.badge && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#E31E2F] text-white text-[10px] font-bold uppercase tracking-wider">
                      {off.badge}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-3xl uppercase text-white">
                    {off.title}
                  </h3>
                  {off.description && (
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {off.description}
                    </p>
                  )}
                  {off.code && (
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-xs text-neutral-400 uppercase">Use Promo Code:</span>
                      <span className="font-mono text-sm font-bold text-white bg-black/60 px-3 py-1 rounded-lg border border-red-500/40">
                        {off.code}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  <Link
                    href={off.ctaUrl || "/shop"}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] text-white font-display text-base uppercase tracking-wider transition-all"
                  >
                    <span>{off.ctaLabel || "CLAIM OFFER"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Discounted Catalogue Grid */}
        <div className="pt-6 space-y-6">
          <h2 className="font-display font-bold text-3xl uppercase tracking-wider text-neutral-900 dark:text-white">
            PRODUCTS ON SALE
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {offerProducts.map((p) => (
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
        </div>
      </div>
    </div>
  );
}
