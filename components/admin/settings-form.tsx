"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        setError("Failed to save store configuration.");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f]">
        <div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white">
            STORE CONFIGURATION
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure contact coordinates, WhatsApp business phone, and hero copywriting
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-base uppercase tracking-wider text-white transition-all red-glow-subtle flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "SAVING..." : "SAVE CONFIGURATION"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Store settings updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {/* Section 1: Store Brand & Contact */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
            BRAND & CONTACT
          </h2>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={settings.store_name || "THE FITNESS STORE"}
              onChange={(e) => handleChange("store_name", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={settings.store_tagline || "Wholesaler & Retailer of Sports & Fitness Goods"}
              onChange={(e) => handleChange("store_tagline", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              WhatsApp Business Number (International Format without +) *
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp_number || "919876543210"}
              onChange={(e) => handleChange("whatsapp_number", e.target.value)}
              placeholder="919876543210"
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] font-mono text-white focus:outline-none focus:border-[#E31E2F]"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              All &ldquo;Order on WhatsApp&rdquo; and cart links route to this exact phone number.
            </p>
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={settings.contact_phone || "+91 98765 43210"}
              onChange={(e) => handleChange("contact_phone", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Customer Support Email
            </label>
            <input
              type="email"
              value={settings.support_email || "support@thefitnessstore.com"}
              onChange={(e) => handleChange("support_email", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Showroom / Warehouse Address
            </label>
            <textarea
              rows={2}
              value={settings.store_address || ""}
              onChange={(e) => handleChange("store_address", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>
        </div>

        {/* Section 2: Homepage Hero Copywriting */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
          <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
            HOMEPAGE COPYWRITING
          </h2>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Hero Eyebrow
            </label>
            <input
              type="text"
              value={settings.hero_eyebrow || "BUILT FOR EVERY REP"}
              onChange={(e) => handleChange("hero_eyebrow", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Hero Main Headline
            </label>
            <textarea
              rows={2}
              value={settings.hero_headline || "YOUR TRAINING. YOUR EQUIPMENT. YOUR LIMITS."}
              onChange={(e) => handleChange("hero_headline", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Hero Description Text
            </label>
            <textarea
              rows={3}
              value={settings.hero_description || ""}
              onChange={(e) => handleChange("hero_description", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Wholesale Section Headline
            </label>
            <input
              type="text"
              value={settings.wholesale_banner_headline || "BUY FOR YOUR GYM. EQUIP YOUR BUSINESS."}
              onChange={(e) => handleChange("wholesale_banner_headline", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Currency Symbol
            </label>
            <input
              type="text"
              value={settings.currency_symbol || "₹"}
              onChange={(e) => handleChange("currency_symbol", e.target.value)}
              className="w-24 px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
