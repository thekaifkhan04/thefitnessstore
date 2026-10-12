"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import { generateSingleProductMessage } from "@/lib/whatsapp";
import { ShoppingBag, MessageSquare, ArrowRight, Check } from "lucide-react";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand?: string | null;
  sellingPricePaise: number;
  originalPricePaise?: number | null;
  isAvailable: boolean;
  categoryName?: string;
  categorySlug?: string;
  imageUrl?: string;
  variantCount?: number;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const { settings, getWhatsAppUrl } = useSettings();
  const [added, setAdded] = React.useState(false);

  const discountPercent = calculateDiscount(
    product.sellingPricePaise,
    product.originalPricePaise
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      image: product.imageUrl || "/images/brand/tfs_logo_emblem.png",
      unitPricePaise: product.sellingPricePaise,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = generateSingleProductMessage(
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        unitPricePaise: product.sellingPricePaise,
        quantity: 1,
      },
      settings.store_name
    );
    window.open(getWhatsAppUrl(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#242424] hover:border-neutral-300 dark:hover:border-[#383838] hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/60 transition-all duration-300 overflow-hidden">
      {/* Product Image Area - Compact & optimized for phone screens */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/3] sm:aspect-square bg-neutral-50 dark:bg-[#0d0d0d] overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-neutral-600">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
          {product.categoryName && (
            <span className="px-1.5 sm:px-2 py-0.5 rounded bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border border-neutral-200 dark:border-[#2b2b2b] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 truncate max-w-[65%]">
              {product.categoryName}
            </span>
          )}

          {discountPercent ? (
            <span className="px-1.5 py-0.5 rounded bg-[#E31E2F] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm ml-auto">
              {discountPercent}% OFF
            </span>
          ) : !product.isAvailable ? (
            <span className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-wider ml-auto">
              Stock
            </span>
          ) : null}
        </div>
      </Link>

      {/* Info & Details - Compact padding */}
      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {product.brand && (
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 truncate mb-0.5">
              {product.brand}
            </p>
          )}
          <Link
            href={`/product/${product.slug}`}
            className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white group-hover:text-[#E31E2F] transition-colors line-clamp-1 sm:line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5 hidden sm:block">Code: {product.sku}</p>
        </div>

        {/* Pricing */}
        <div className="pt-1.5 border-t border-neutral-100 dark:border-[#1f1f1f] flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-base sm:text-lg font-bold text-neutral-900 dark:text-white tracking-wide">
              {formatINR(product.sellingPricePaise)}
            </span>
            {product.originalPricePaise && product.originalPricePaise > product.sellingPricePaise && (
              <span className="text-[10px] sm:text-xs text-neutral-400 dark:text-neutral-500 line-through">
                {formatINR(product.originalPricePaise)}
              </span>
            )}
          </div>
          {product.variantCount && product.variantCount > 1 ? (
            <span className="text-[9px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-[#1e1e1e] px-1.5 py-0.5 rounded shrink-0">
              {product.variantCount} opts
            </span>
          ) : null}
        </div>

        {/* Actions - Compact buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <button
            onClick={handleAddToCart}
            className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-[#202020] dark:hover:bg-[#282828] dark:text-white border border-neutral-200 dark:border-[#2f2f2f]"
            }`}
            title="Add to shopping bag"
          >
            {added ? (
              <>
                <Check className="w-3 h-3" />
                <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 shrink-0" />
                <span className="truncate">+ Bag</span>
              </>
            )}
          </button>

          <button
            onClick={handleQuickWhatsApp}
            className="py-1.5 px-2 rounded-lg bg-[#E31E2F] hover:bg-[#c51826] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
            title="Enquire directly on WhatsApp"
          >
            <MessageSquare className="w-3 h-3 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
