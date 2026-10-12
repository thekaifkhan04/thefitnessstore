"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { generateSingleProductMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Share2,
  ChevronRight,
} from "lucide-react";

interface Variant {
  id: string;
  name: string;
  size?: string | null;
  weight?: string | null;
  color?: string | null;
  sku?: string | null;
  pricePaise?: number | null;
  stock: number;
  isAvailable: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    brand?: string | null;
    shortDescription?: string | null;
    fullDescription?: string | null;
    sellingPricePaise: number;
    originalPricePaise?: number | null;
    stock: number;
    isAvailable: boolean;
    specifications?: string | null;
    category: {
      name: string;
      slug: string;
    };
    images: ProductImage[];
    variants: Variant[];
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const { addItem } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants[0]?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const activePricePaise = selectedVariant?.pricePaise || product.sellingPricePaise;
  const activeOriginalPricePaise = product.originalPricePaise;
  const discountPercent = calculateDiscount(activePricePaise, activeOriginalPricePaise);

  const images = product.images.length > 0
    ? product.images
    : [{ id: "placeholder", url: "/images/brand/tfs_logo_emblem.png", alt: product.name }];

  const activeImage = images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: selectedVariant?.sku || product.sku,
      image: activeImage.url,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      unitPricePaise: activePricePaise,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleOrderOnWhatsApp = () => {
    const message = generateSingleProductMessage({
      id: product.id,
      name: product.name,
      sku: selectedVariant?.sku || product.sku,
      variantName: selectedVariant?.name,
      unitPricePaise: activePricePaise,
      quantity,
    });
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left: Product Images Gallery */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Image Display */}
        <div className="relative aspect-square w-full rounded-3xl bg-[#111111] border border-[#262626] overflow-hidden flex items-center justify-center p-6 shadow-2xl">
          <Image
            src={activeImage.url}
            alt={activeImage.alt || product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain p-4 transition-all duration-300 hover:scale-105"
          />

          {discountPercent ? (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#E31E2F] text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              {discountPercent}% OFF
            </div>
          ) : null}

          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[#1c1c1c]/80 backdrop-blur-md border border-[#333333] text-neutral-300 hover:text-white transition-colors"
            title="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copiedLink && (
            <span className="absolute top-16 right-4 px-3 py-1 rounded-md bg-[#25D366] text-black font-bold text-[10px] uppercase shadow-md animate-in fade-in">
              Link Copied!
            </span>
          )}
        </div>

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-20 h-20 rounded-xl bg-[#141414] border-2 overflow-hidden shrink-0 transition-all ${
                  selectedImageIndex === idx
                    ? "border-[#E31E2F] scale-95"
                    : "border-[#292929] opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Product thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Purchase & Details */}
      <div className="lg:col-span-5 space-y-6">
        {/* Category & Brand info */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            <Link
              href={`/shop/${product.category.slug}`}
              className="text-[#E31E2F] hover:underline"
            >
              {product.category.name}
            </Link>
            {product.brand && (
              <>
                <span>·</span>
                <span className="text-neutral-300">{product.brand}</span>
              </>
            )}
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
            <span>SKU: {selectedVariant?.sku || product.sku}</span>
            <span>·</span>
            <span
              className={`font-semibold ${
                product.isAvailable ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {product.isAvailable ? "In Stock (Confirm via WhatsApp)" : "Limited Stock"}
            </span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-extrabold text-white tracking-wide">
                {formatINR(activePricePaise)}
              </span>
              {activeOriginalPricePaise && activeOriginalPricePaise > activePricePaise && (
                <span className="text-sm text-neutral-500 line-through">
                  {formatINR(activeOriginalPricePaise)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              *Taxes included. Delivery charges confirmed on WhatsApp based on destination.
            </p>
          </div>
          {discountPercent ? (
            <span className="px-2.5 py-1 rounded-md bg-[#E31E2F]/15 border border-[#E31E2F]/40 text-[#E31E2F] font-bold text-xs">
              Save {discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-sm text-neutral-300 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Variant Selector */}
        {product.variants.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
              SELECT OPTION / VARIANT:
            </label>
            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                      isSelected
                        ? "bg-[#E31E2F] text-white border-[#E31E2F] shadow-md red-glow-subtle"
                        : "bg-[#161616] text-neutral-300 border-[#2b2b2b] hover:border-neutral-500 hover:text-white"
                    }`}
                  >
                    <span>{v.name}</span>
                    {v.pricePaise && v.pricePaise !== product.sellingPricePaise && (
                      <span className="ml-1.5 opacity-80 text-[10px]">
                        ({formatINR(v.pricePaise)})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
            QUANTITY:
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-[#2e2e2e] rounded-xl bg-[#141414]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-neutral-400 hover:text-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-neutral-400 hover:text-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-neutral-500">
              Subtotal: <strong className="text-white">{formatINR(activePricePaise * quantity)}</strong>
            </span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          {/* Primary: Direct WhatsApp Order Enquiry */}
          <button
            onClick={handleOrderOnWhatsApp}
            className="w-full py-4 px-6 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] active:scale-[0.99] font-display text-xl uppercase tracking-wider text-white transition-all duration-200 red-glow flex items-center justify-center gap-3 cursor-pointer shadow-xl"
          >
            <MessageSquare className="w-5 h-5 text-white" />
            <span>ORDER ON WHATSAPP</span>
          </button>

          {/* Secondary: Add to Cart Drawer */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-6 rounded-xl border text-sm font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              addedToCart
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-[#181818] hover:bg-[#222222] text-white border-[#2e2e2e]"
            }`}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-neutral-300" />
                <span>ADD TO SHOPPING BAG</span>
              </>
            )}
          </button>
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#1f1f1f] text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E31E2F]" />
            <span>100% Genuine Quality</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#E31E2F]" />
            <span>Fast India-Wide Dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#E31E2F]" />
            <span>Wholesale Pricing on Bulk</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#E31E2F]" />
            <span>Replacement for Transit Damage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
