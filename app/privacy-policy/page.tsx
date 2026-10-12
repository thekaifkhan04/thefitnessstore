import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for THE FITNESS STORE (TFS).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white mb-6">
          PRIVACY POLICY
        </h1>
        <div className="text-xs text-neutral-500 mb-8">Last Updated: October 2026</div>

        <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed space-y-6">
          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">1. Overview</h2>
            <p>
              At <strong>THE FITNESS STORE (TFS)</strong>, we respect your privacy. This policy explains how we collect and manage customer information when you use our catalogue website or initiate enquiries via WhatsApp.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">2. Information Collected</h2>
            <p>
              When browsing the catalogue, we do not require user account registration for shoppers. When you choose to place an order enquiry on WhatsApp, you directly communicate your contact details, product selections, and delivery address with our store staff.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">3. How We Use Information</h2>
            <p>
              Your contact details and order selections are used strictly to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>Confirm item availability and calculate delivery charges.</li>
              <li>Coordinate courier or road freight dispatch to your address.</li>
              <li>Provide order tracking and customer support updates.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">4. Third-Party Services</h2>
            <p>
              When you click &ldquo;Order on WhatsApp&rdquo;, you are redirected to WhatsApp, which operates under Meta&apos;s privacy policy. We do not store sensitive payment card details on our website servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl text-white uppercase tracking-wider">5. Contact Us</h2>
            <p>
              If you have any questions regarding your data, please contact us at <span className="text-white font-mono">support@thefitnessstore.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
