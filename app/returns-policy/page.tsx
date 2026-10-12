import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Replacement Policy",
  description: "Transit damage and replacement policies at THE FITNESS STORE.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white mb-6">
          RETURN & REPLACEMENT POLICY
        </h1>
        <div className="text-xs text-neutral-500 mb-8">Updated: October 2026</div>

        <div className="max-w-none text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">1. Transit Damage Guarantee</h2>
            <p>
              In the unlikely event that any gear arrives damaged or defective in transit, please record an unboxing video or photograph the defect and notify our WhatsApp support team within 48 hours of delivery. We will arrange a prompt replacement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">2. Size Exchanges (Belts & Apparel)</h2>
            <p>
              If your Technosport trackpant or weightlifting lever belt sizing needs an exchange, we support size replacement provided the item is unused, in original condition with tags intact.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">3. Non-Returnable Items</h2>
            <p>
              Opened food/supplement packages (peanut butter, protein jars) and custom-ordered gym equipment fabrications cannot be returned once unsealed or manufactured.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
