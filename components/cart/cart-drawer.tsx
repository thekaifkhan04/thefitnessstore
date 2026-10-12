"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import { formatINR } from "@/lib/utils";
import { generateCartOrderMessage } from "@/lib/whatsapp";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotalPaise,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { settings, getWhatsAppUrl } = useSettings();

  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastEnquiryRef, setLastEnquiryRef] = useState<string | null>(null);

  const handleOrderOnWhatsApp = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    let enquiryRef = `TFS-${Date.now().toString().slice(-6)}`;
    setLastEnquiryRef(enquiryRef);

    // Format WhatsApp message
    const message = generateCartOrderMessage(
      items.map((i) => ({
        id: i.productId,
        name: i.name,
        sku: i.sku,
        variantName: i.variantName,
        quantity: i.quantity,
        unitPricePaise: i.unitPricePaise,
      })),
      {
        reference: enquiryRef,
        customerName: customerName.trim() || undefined,
        customerNote: customerNote.trim() || undefined,
        storeName: settings.store_name,
      }
    );

    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-[#111111] border-l border-[#262626] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#262626] bg-[#0c0c0c]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[#E31E2F]" />
                <h2 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                  YOUR CART ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#262626] flex items-center justify-center text-neutral-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                      YOUR BAG IS EMPTY
                    </h3>
                    <p className="text-sm text-neutral-400 max-w-xs">
                      Explore our fitness equipment, apparel, and supplements to equip your training.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-6 py-3 rounded-lg bg-[#E31E2F] hover:bg-[#c51826] font-display text-lg uppercase tracking-wider text-white transition-all red-glow-subtle flex items-center gap-2"
                  >
                    START SHOPPING <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {lastEnquiryRef && (
                    <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">WhatsApp Enquiry Generated</p>
                        <p className="text-emerald-400/80">Ref: {lastEnquiryRef}. Please complete your message on WhatsApp to confirm delivery.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3.5 rounded-xl bg-[#161616] border border-[#262626] hover:border-[#383838] transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-900 border border-[#282828] shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/product/${item.slug}`}
                                onClick={closeCart}
                                className="font-semibold text-sm text-white hover:text-[#E31E2F] transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {item.variantName && (
                              <p className="text-xs text-neutral-400 mt-0.5">
                                Variant: <span className="text-neutral-300">{item.variantName}</span>
                              </p>
                            )}
                            <p className="text-xs text-neutral-500">Code: {item.sku}</p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-[#2f2f2f] rounded-lg bg-[#111111]">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <span className="font-display text-base font-bold text-white">
                              {formatINR(item.unitPricePaise * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Optional customer info for enquiry */}
                  <div className="pt-2 border-t border-[#262626] space-y-2.5">
                    <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      ENQUIRY DETAILS (OPTIONAL)
                    </p>
                    <input
                      type="text"
                      placeholder="Your Name (optional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#181818] border border-[#2b2b2b] text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                    />
                    <input
                      type="text"
                      placeholder="Delivery location / pincode / note"
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-[#181818] border border-[#2b2b2b] text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#262626] bg-[#0c0c0c] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-neutral-400 text-sm">
                    <span>Estimated Subtotal</span>
                    <span className="text-white font-semibold">{formatINR(subtotalPaise)}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">
                    *Final delivery charges and item stock are confirmed directly through WhatsApp. No online payment required.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={handleOrderOnWhatsApp}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] active:scale-[0.99] font-display text-lg uppercase tracking-wider text-white transition-all red-glow flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
                  >
                    <MessageSquareQuote className="w-5 h-5" />
                    <span>{isSubmitting ? "PREPARING ENQUIRY..." : "ORDER ON WHATSAPP"}</span>
                  </button>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={clearCart}
                      className="text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
                    >
                      Clear cart
                    </button>
                    <button
                      onClick={closeCart}
                      className="text-xs text-neutral-400 hover:text-white transition-colors"
                    >
                      Continue shopping &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
