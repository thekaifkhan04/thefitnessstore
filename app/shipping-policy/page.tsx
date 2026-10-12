import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Dispatch Policy",
  description: "Shipping and dispatch information for fitness equipment at THE FITNESS STORE.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mb-6">
          SHIPPING & DISPATCH POLICY
        </h1>
        <div className="text-xs text-neutral-500 mb-8">Updated: October 2026</div>

        <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">1. Dispatch Timelines</h2>
            <p>
              Standard retail orders (belts, apparel, resistance bands, shakers) are dispatched within 24 to 48 hours of WhatsApp order confirmation. Heavy equipment orders (platforms, racks, plate sets) are scheduled for crate packing and dispatched within 2 to 4 business days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">2. Freight & Logistics Partners</h2>
            <p>
              Lightweight parcels are shipped via trusted express air couriers. Heavy commercial equipment is transported via dedicated surface freight logistics. Tracking airway bill numbers (AWB) are shared directly on WhatsApp upon vehicle pickup.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">3. Delivery Charges</h2>
            <p>
              Because sports equipment weight varies significantly (from a 200g jump rope to a 200kg dumbbell set), shipping charges are calculated transparently based on actual weight and destination pincode during your WhatsApp consultation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
