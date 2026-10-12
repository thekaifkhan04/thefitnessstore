import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions of sale and catalogue usage at THE FITNESS STORE.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white mb-6">
          TERMS & CONDITIONS
        </h1>
        <div className="text-xs text-neutral-500 mb-8">Effective Date: October 2026</div>

        <div className="max-w-none text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="font-display text-xl text-neutral-900 dark:text-white uppercase tracking-wider">1. Nature of the Service</h2>
            <p>
              THE FITNESS STORE (TFS) operates as a retailer and wholesaler of sports goods, gym equipment, and accessories. Our website is a digital product catalogue designed to facilitate direct business and retail communication via WhatsApp.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-neutral-900 dark:text-white uppercase tracking-wider">2. Order Enquiries & Confirmation</h2>
            <p>
              Submitting an item to cart or clicking &ldquo;Order on WhatsApp&rdquo; creates an order enquiry. An order is only confirmed once store management verifies physical inventory, confirms final shipping costs, and mutually agrees on payment terms directly with the customer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-neutral-900 dark:text-white uppercase tracking-wider">3. Pricing & Specifications</h2>
            <p>
              While we strive for 100% accurate catalogue listings, prices and weights may occasionally be subject to manufacturer updates or raw material fluctuations. Final applicable prices are always confirmed prior to dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-neutral-900 dark:text-white uppercase tracking-wider">4. Wholesale Orders</h2>
            <p>
              Commercial gym orders and bulk equipment purchases are subject to specific freight agreements and dispatch schedules outlined during conversation with our B2B representative.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
