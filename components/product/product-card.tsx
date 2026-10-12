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
    <div className="group relative flex flex-col rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#383838] hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 overflow-hidden">
      {/* Product Image Area */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square bg-[#0f0f0f] overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.categoryName && (
            <span className="px-2.5 py-1 rounded-md bg-[#0a0a0a]/85 backdrop-blur-md border border-[#2b2b2b] text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
              {product.categoryName}
            </span>
          )}

          {discountPercent ? (
            <span className="px-2 py-0.5 rounded-md bg-[#E31E2F] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
              {discountPercent}% OFF
            </span>
          ) : !product.isAvailable ? (
            <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
              Enquire Stock
            </span>
          ) : null}
        </div>
      </Link>

      {/* Info & Details */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {product.brand && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 mb-1">
              {product.brand}
            </p>
          )}
          <Link
            href={`/product/${product.slug}`}
            className="font-bold text-sm text-white group-hover:text-[#E31E2F] transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
          <p className="text-[11px] text-neutral-500 mt-0.5">Code: {product.sku}</p>
        </div>

        {/* Pricing */}
        <div className="pt-2 border-t border-[#1f1f1f] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-white tracking-wide">
              {formatINR(product.sellingPricePaise)}
            </span>
            {product.originalPricePaise && product.originalPricePaise > product.sellingPricePaise && (
              <span className="text-xs text-neutral-500 line-through">
                {formatINR(product.originalPricePaise)}
              </span>
            )}
          </div>
          {product.variantCount && product.variantCount > 1 ? (
            <span className="text-[10px] text-neutral-400 bg-[#1e1e1e] px-2 py-0.5 rounded">
              {product.variantCount} Options
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleAddToCart}
            className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#202020] hover:bg-[#282828] text-white border border-[#2f2f2f]"
            }`}
            title="Add to shopping bag"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleQuickWhatsApp}
            className="py-2 px-3 rounded-lg bg-[#E31E2F] hover:bg-[#c51826] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(227,30,47,0.3)]"
            title="Enquire directly on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
