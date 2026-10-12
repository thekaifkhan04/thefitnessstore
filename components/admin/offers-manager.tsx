"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Trash2, Flame, X, Check, AlertCircle } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  badge: string | null;
  description: string | null;
  code: string | null;
  discountPercent: number | null;
  isActive: boolean;
  ctaLabel: string | null;
  ctaUrl: string | null;
}

export function OffersManager({ offers }: { offers: Offer[] }) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [title, setTitle] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number | "">("");
  const [ctaLabel, setCtaLabel] = useState("SHOP NOW");
  const [ctaUrl, setCtaUrl] = useState("/shop");
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingOffer(null);
    setTitle("");
    setBadge("SPECIAL OFFER");
    setDescription("");
    setCode("");
    setDiscountPercent("");
    setCtaLabel("SHOP NOW");
    setCtaUrl("/shop");
    setIsActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (off: Offer) => {
    setEditingOffer(off);
    setTitle(off.title);
    setBadge(off.badge || "");
    setDescription(off.description || "");
    setCode(off.code || "");
    setDiscountPercent(off.discountPercent ?? "");
    setCtaLabel(off.ctaLabel || "SHOP NOW");
    setCtaUrl(off.ctaUrl || "/shop");
    setIsActive(off.isActive);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        badge: badge.trim() || null,
        description: description.trim() || null,
        code: code.trim() || null,
        discountPercent: discountPercent === "" ? null : Number(discountPercent),
        ctaLabel,
        ctaUrl,
        isActive,
      };

      const endpoint = editingOffer
        ? `/api/admin/offers/${editingOffer.id}`
        : `/api/admin/offers`;

      const method = editingOffer ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save offer.");
      } else {
        setIsModalOpen(false);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (off: Offer) => {
    if (!window.confirm(`Delete offer "${off.title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/offers/${off.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete offer.");
      }
    } catch {
      alert("Error deleting offer.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f]">
        <div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white">
            PROMOTIONAL OFFERS & BANNERS
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage discount codes, homepage banners, and limited deal announcements
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-base uppercase tracking-wider text-white transition-all red-glow-subtle flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE OFFER</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((off) => (
          <div
            key={off.id}
            className="p-6 rounded-2xl bg-[#121212] border border-[#242424] flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                {off.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E31E2F] text-white">
                    {off.badge}
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    off.isActive
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                      : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  {off.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl uppercase text-white">
                {off.title}
              </h3>

              {off.description && (
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {off.description}
                </p>
              )}

              {off.code && (
                <div className="pt-1 text-xs">
                  <span className="text-neutral-500 mr-2 uppercase">Promo Code:</span>
                  <span className="font-mono font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-[#333]">
                    {off.code}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#1e1e1e] flex items-center justify-between text-xs">
              <span className="text-neutral-500">CTA: {off.ctaLabel} ({off.ctaUrl})</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(off)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202020]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(off)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#121212] border border-[#282828] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                {editingOffer ? "EDIT PROMOTION" : "NEW PROMOTION"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flat 15% Off On Lever Belts"
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="LIMITED OFFER / COMBO"
                    className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Promo Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="TFSBELT15"
                    className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Offer Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of the promotion and WhatsApp ordering instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#E31E2F]"
                />
                <span className="font-medium text-white">Active (Display on Homepage & Offers page)</span>
              </label>

              <div className="pt-3 border-t border-[#222222] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] text-white font-semibold flex items-center gap-2 disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? "Saving..." : "Save Offer"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
