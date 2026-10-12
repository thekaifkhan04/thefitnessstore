"use client";

import React, { useState } from "react";
import { generateWholesaleMessage } from "@/lib/whatsapp";
import { useSettings } from "@/context/settings-context";
import { MessageSquare, Building2, Package, Truck, CheckCircle2, ArrowRight } from "lucide-react";

export default function BulkOrdersPage() {
  const { settings, getWhatsAppUrl } = useSettings();
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Commercial Gym Equipment");
  const [requirement, setRequirement] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !requirement.trim()) return;

    const message = generateWholesaleMessage({
      name: name.trim(),
      organization: organization.trim() || undefined,
      phone: phone.trim() || undefined,
      category,
      requirement: requirement.trim(),
    });

    const url = getWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-[#1f1f1f] text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31E2F]/15 border border-[#E31E2F]/40 text-[#E31E2F] text-xs font-bold uppercase tracking-wider">
            <span>B2B & COMMERCIAL WHOLESALE</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight">
            {(settings.wholesale_banner_headline || "BUY FOR YOUR GYM. EQUIP YOUR BUSINESS.")
              .split("\n")
              .map((line, idx, arr) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Looking for fitness equipment in bulk? THE FITNESS STORE supplies commercial gym franchises, fitness studios, sports academies, and corporate gyms across India with verified inventory and direct dealer pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-12 items-start">
          {/* Left: Wholesale Advantages */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-display font-bold text-2xl uppercase tracking-wide text-white">
              WHOLESALE BENEFITS
            </h2>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-[#E31E2F] shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Full Facility Setup</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Bumper plates stands, flat benches, deadlift platforms, and multi-stations sourced directly.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-[#E31E2F] shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Volume Tiered Pricing</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Substantial discounts on bulk dumbbells, rubber weight plates, power bands, and shakers.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#242424] flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-[#E31E2F] shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Reliable Freight & Transit</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Heavy equipment packed securely in wooden crates and dispatched via trusted road logistics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#131313] border border-[#292929] p-8 sm:p-10 shadow-2xl">
              <h2 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white mb-2">
                SEND WHOLESALE ENQUIRY
              </h2>
              <p className="text-xs text-neutral-400 mb-8">
                Fill in your equipment requirements below. Submitting will open WhatsApp with your customized enquiry pre-filled.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Gym / Business Name
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Iron Clad Gym Club"
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Primary Interest
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-sm text-white focus:outline-none focus:border-[#E31E2F]"
                    >
                      <option value="Commercial Gym Equipment">Commercial Gym Equipment</option>
                      <option value="Dumbbells & Weight Plates">Dumbbells & Weight Plates</option>
                      <option value="Rods & Barbells">Rods & Barbells</option>
                      <option value="Powerlifting Belts (13mm/11mm)">Powerlifting Belts (13mm/11mm)</option>
                      <option value="Gym Wear & Apparel">Gym Wear & Apparel</option>
                      <option value="Supplements & Peanut Butter">Supplements & Peanut Butter</option>
                      <option value="Full Gym Floor Package">Full Gym Floor Package</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Estimated Quantities & Requirement Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    placeholder="e.g. Looking for 10 pairs of 5kg-20kg dumbbells, 2 flat benches, 1 deadlift platform, and delivery to Bangalore."
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-xl uppercase tracking-wider text-white transition-all red-glow flex items-center justify-center gap-3 cursor-pointer shadow-xl mt-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>ENQUIRE ON WHATSAPP</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
