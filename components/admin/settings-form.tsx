"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TFSLogoEmblem } from "@/components/brand/tfs-logo";
import { useSettings } from "@/context/settings-context";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  RotateCcw,
  Palette,
  Type,
  Phone,
  Mail,
  MapPin,
  Layers,
  Flame,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

const THEME_PRESETS = [
  { name: "TFS Crimson Red (Default)", color: "#E31E2F", class: "bg-[#E31E2F]" },
  { name: "Neon Emerald Green", color: "#10B981", class: "bg-[#10B981]" },
  { name: "Electric Amber Gold", color: "#F59E0B", class: "bg-[#F59E0B]" },
  { name: "Cyber Blue / Cyan", color: "#0EA5E9", class: "bg-[#0EA5E9]" },
  { name: "Hyper Royal Violet", color: "#8B5CF6", class: "bg-[#8B5CF6]" },
  { name: "Blaze Performance Orange", color: "#F97316", class: "bg-[#F97316]" },
];

const TEXT_COLOR_PRESETS = [
  { name: "Pure White (Default)", color: "#FFFFFF" },
  { name: "Soft Platinum", color: "#F3F4F6" },
  { name: "Cool Silver", color: "#E2E8F0" },
  { name: "Warm Cream", color: "#FEF3C7" },
  { name: "Champagne Gold", color: "#FDE68A" },
];

const MUTED_COLOR_PRESETS = [
  { name: "Silver Gray (Default)", color: "#A6A6A6" },
  { name: "Cool Slate", color: "#94A3B8" },
  { name: "Medium Neutral", color: "#737373" },
  { name: "Warm Taupe", color: "#A8A29E" },
];

const FONT_OPTIONS = [
  { id: "bebas", name: "Bebas Neue", desc: "Athletic Display & Impact (Store Default)" },
  { id: "oswald", name: "Oswald", desc: "Condensed Heavyweight Athletic" },
  { id: "montserrat", name: "Montserrat", desc: "Modern Geometric Bold" },
  { id: "inter", name: "Inter", desc: "Clean Minimalist Sans" },
  { id: "impact", name: "Impact", desc: "Industrial Heavyweight Bold" },
];

const STYLE_OPTIONS = [
  { id: "uppercase", name: "ALL UPPERCASE", desc: "Aggressive athletic bold (Default)" },
  { id: "none", name: "Normal Case", desc: "Original text capitalization" },
  { id: "capitalize", name: "Capitalize", desc: "Title Case Each Word" },
];

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const { updateSettings } = useSettings();
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeColor = settings.theme_primary_color || "#E31E2F";
  const activeTextColor = settings.theme_text_color || "#FFFFFF";
  const activeMutedColor = settings.theme_muted_text_color || "#A6A6A6";
  const activeFont = settings.theme_heading_font || "bebas";
  const activeStyle = settings.theme_heading_style || "uppercase";

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      if (
        [
          "theme_primary_color",
          "theme_text_color",
          "theme_muted_text_color",
          "theme_heading_font",
          "theme_heading_style",
          "store_name",
        ].includes(key)
      ) {
        updateSettings({ [key]: value } as any);
      }
      return next;
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload logo image");
      }

      const data = await res.json();
      if (data.url) {
        const nextSettings = { ...settings, store_logo_url: data.url };
        setSettings(nextSettings);
        updateSettings(nextSettings as any);

        // Forcibly persist immediately to the database
        await fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nextSettings),
        });

        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleResetLogo = async () => {
    const nextSettings = { ...settings, store_logo_url: "" };
    setSettings(nextSettings);
    updateSettings(nextSettings as any);

    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextSettings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch {}
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
        updateSettings(settings as any);
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
            STORE CONFIGURATION & THEME
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Customize store logo, website theme color, contact coordinates, WhatsApp phone, and hero copywriting
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ backgroundColor: activeColor }}
          className="px-6 py-2.5 rounded-xl font-display text-base uppercase tracking-wider text-white transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto disabled:opacity-60 shadow-lg hover:brightness-110"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "SAVING..." : "SAVE CONFIGURATION"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Store settings and theme updated successfully! Live website refreshed.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
        {/* Section 1: Store Logo & Visual Branding */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-neutral-400" />
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
              STORE LOGO & BRANDING
            </h2>
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={settings.store_name || "THE FITNESS STORE"}
              onChange={(e) => handleChange("store_name", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
            />
          </div>

          {/* Logo Upload & Preview */}
          <div className="pt-2 border-t border-[#1e1e1e] space-y-3">
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block">
              Custom Logo (PNG, JPG, SVG or WebP)
            </label>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#181818] border border-[#2a2a2a]">
              {/* Preview */}
              <div className="w-16 h-16 rounded-xl bg-[#101010] border border-[#333] flex items-center justify-center p-2 relative overflow-hidden shrink-0">
                {settings.store_logo_url ? (
                  <Image
                    src={settings.store_logo_url}
                    alt="Current Store Logo"
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                ) : (
                  <TFSLogoEmblem className="w-10 h-10" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="text-[11px] text-neutral-400">
                  {settings.store_logo_url ? "Using custom uploaded logo" : "Using default TFS athletic geometric emblem"}
                </div>

                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#303030] border border-[#3a3a3a] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingLogo ? "Uploading..." : "Upload Logo File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                      className="hidden"
                    />
                  </label>

                  {settings.store_logo_url && (
                    <button
                      type="button"
                      onClick={handleResetLogo}
                      className="px-3 py-1.5 rounded-lg bg-[#1f1f1f] hover:bg-red-950/40 hover:text-red-400 text-neutral-400 text-xs flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Default</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">
                Or enter Logo Image URL directly:
              </label>
              <input
                type="text"
                placeholder="/images/brand/custom-logo.png or https://..."
                value={settings.store_logo_url || ""}
                onChange={(e) => handleChange("store_logo_url", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white text-xs font-mono focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Website Color Theme Customizer */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-neutral-400" />
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
                WEBSITE ACCENT COLOR THEME
              </h2>
            </div>
            <div
              className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: activeColor }}
            />
          </div>

          <p className="text-neutral-400 text-xs leading-relaxed">
            Select a performance brand color preset or pick any custom hex shade. Buttons, badges, icons, accent lines, and glows will update across the entire store.
          </p>

          {/* Presets Grid */}
          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-2">
              Athletic Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = activeColor.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => handleChange("theme_primary_color", preset.color)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1e1e1e] border-white/80 shadow-md ring-1 ring-white/50"
                        : "bg-[#171717] border-[#292929] hover:border-neutral-500 hover:bg-[#1d1d1d]"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-[11px] font-semibold text-neutral-200 truncate">
                      {preset.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Color Inputs */}
          <div className="pt-2 border-t border-[#1e1e1e]">
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Custom Color Picker
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeColor}
                onChange={(e) => handleChange("theme_primary_color", e.target.value)}
                className="w-10 h-10 rounded-xl bg-transparent border border-[#333] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={activeColor}
                onChange={(e) => handleChange("theme_primary_color", e.target.value)}
                placeholder="#E31E2F"
                className="w-28 px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white font-mono uppercase text-xs focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500">Pick any custom hex code</span>
            </div>
          </div>
        </div>

        {/* Section 3: Website Typography & Text Styling Customizer */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-neutral-400" />
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
                WEBSITE TYPOGRAPHY & TEXT STYLING
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                handleChange("theme_text_color", "#FFFFFF");
                handleChange("theme_muted_text_color", "#A6A6A6");
                handleChange("theme_heading_font", "bebas");
                handleChange("theme_heading_style", "uppercase");
              }}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Typography</span>
            </button>
          </div>

          <p className="text-neutral-400 text-xs leading-relaxed">
            Customize the dedicated primary text color, muted/secondary text color, heading display font family, and typography styling for the entire website.
          </p>

          {/* Primary Text Color */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-neutral-300 text-xs block">
                Primary Text Color (Headings & Main Content)
              </label>
              <div
                className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: activeTextColor }}
              />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {TEXT_COLOR_PRESETS.map((p) => {
                const isSelected = activeTextColor.toLowerCase() === p.color.toLowerCase();
                return (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => handleChange("theme_text_color", p.color)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1e1e1e] border-white/80 ring-1 ring-white/40"
                        : "bg-[#171717] border-[#292929] hover:border-neutral-500"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/40"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[11px] font-semibold text-neutral-300 truncate">
                      {p.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Picker */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={activeTextColor}
                onChange={(e) => handleChange("theme_text_color", e.target.value)}
                className="w-9 h-9 rounded-xl bg-transparent border border-[#333] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={activeTextColor}
                onChange={(e) => handleChange("theme_text_color", e.target.value)}
                placeholder="#FFFFFF"
                className="w-28 px-3 py-1.5 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white font-mono uppercase text-xs focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500">Pick any custom hex shade</span>
            </div>
          </div>

          {/* Secondary / Muted Text Color */}
          <div className="space-y-3 pt-3 border-t border-[#1e1e1e]">
            <div className="flex items-center justify-between">
              <label className="font-semibold uppercase tracking-wider text-neutral-300 text-xs block">
                Secondary & Muted Text Color (Descriptions, Subtitles & SKU)
              </label>
              <div
                className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: activeMutedColor }}
              />
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MUTED_COLOR_PRESETS.map((p) => {
                const isSelected = activeMutedColor.toLowerCase() === p.color.toLowerCase();
                return (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => handleChange("theme_muted_text_color", p.color)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1e1e1e] border-white/80 ring-1 ring-white/40"
                        : "bg-[#171717] border-[#292929] hover:border-neutral-500"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/40"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[11px] font-semibold text-neutral-300 truncate">
                      {p.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Picker */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={activeMutedColor}
                onChange={(e) => handleChange("theme_muted_text_color", e.target.value)}
                className="w-9 h-9 rounded-xl bg-transparent border border-[#333] cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={activeMutedColor}
                onChange={(e) => handleChange("theme_muted_text_color", e.target.value)}
                placeholder="#A6A6A6"
                className="w-28 px-3 py-1.5 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white font-mono uppercase text-xs focus:outline-none"
              />
              <span className="text-[11px] text-neutral-500">Pick any custom hex shade</span>
            </div>
          </div>

          {/* Heading Display Font Family */}
          <div className="space-y-3 pt-3 border-t border-[#1e1e1e]">
            <label className="font-semibold uppercase tracking-wider text-neutral-300 text-xs block">
              Major Headings Display Font Family
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {FONT_OPTIONS.map((f) => {
                const isSelected = activeFont.toLowerCase() === f.id.toLowerCase();
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleChange("theme_heading_font", f.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1e1e1e] border-white/80 ring-1 ring-white/40"
                        : "bg-[#171717] border-[#292929] hover:border-neutral-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white uppercase">{f.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400">{f.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heading Letter Case / Style */}
          <div className="space-y-3 pt-3 border-t border-[#1e1e1e]">
            <label className="font-semibold uppercase tracking-wider text-neutral-300 text-xs block">
              Heading Letter Case Style
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {STYLE_OPTIONS.map((s) => {
                const isSelected = activeStyle.toLowerCase() === s.id.toLowerCase();
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleChange("theme_heading_style", s.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1e1e1e] border-white/80 ring-1 ring-white/40"
                        : "bg-[#171717] border-[#292929] hover:border-neutral-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{s.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-emerald-400">ACTIVE</span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400">{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Contact Coordinates & WhatsApp */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-neutral-400" />
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
              CONTACT & WHATSAPP
            </h2>
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              WhatsApp Business Number (Country Code + Number, no +) *
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp_number || "919876543210"}
              onChange={(e) => handleChange("whatsapp_number", e.target.value)}
              placeholder="919876543210"
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] font-mono text-white focus:outline-none focus:border-neutral-400"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              All product enquiry clicks and floating button route to this number.
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
            />
          </div>
        </div>

        {/* Section 4: Homepage Copywriting */}
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
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
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
            />
          </div>
        </div>

        {/* Section 5: Homepage Hero Featured Category Card */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#E31E2F]" />
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
                HOMEPAGE HERO FEATURED CATEGORY CARD
              </h2>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Top of Homepage</span>
          </div>

          <p className="text-neutral-400 text-xs leading-relaxed">
            Customize the prominent athletic showcase card displayed in the right column of the landing page hero section.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={settings.hero_featured_badge || "FEATURED CATEGORY"}
                onChange={(e) => handleChange("hero_featured_badge", e.target.value)}
                placeholder="FEATURED CATEGORY"
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Category Card Title
              </label>
              <input
                type="text"
                value={settings.hero_featured_title || "IPF-SPEC LEVER BELTS"}
                onChange={(e) => handleChange("hero_featured_title", e.target.value)}
                placeholder="IPF-SPEC LEVER BELTS"
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Subtitle / Specification Line
            </label>
            <input
              type="text"
              value={
                settings.hero_featured_subtitle ||
                "13MM & 11MM HEAVY-DUTY GENUINE LEATHER · STEEL LEVER MECHANISM"
              }
              onChange={(e) => handleChange("hero_featured_subtitle", e.target.value)}
              placeholder="13MM & 11MM HEAVY-DUTY GENUINE LEATHER · STEEL LEVER MECHANISM"
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
            />
          </div>

          {/* 3 Metrics Grid */}
          <div className="pt-2 border-t border-[#1e1e1e] space-y-2">
            <span className="font-semibold uppercase tracking-wider text-neutral-300 text-xs block">
              3 Highlights / Specifications Strip
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Metric 1 */}
              <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Spec 1</span>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block">Value</label>
                  <input
                    type="text"
                    value={settings.hero_featured_metric1_val || "13mm"}
                    onChange={(e) => handleChange("hero_featured_metric1_val", e.target.value)}
                    placeholder="13mm"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-white text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block">Label</label>
                  <input
                    type="text"
                    value={settings.hero_featured_metric1_lbl || "IPF Spec"}
                    onChange={(e) => handleChange("hero_featured_metric1_lbl", e.target.value)}
                    placeholder="IPF Spec"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Spec 2</span>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block">Value</label>
                  <input
                    type="text"
                    value={settings.hero_featured_metric2_val || "Steel"}
                    onChange={(e) => handleChange("hero_featured_metric2_val", e.target.value)}
                    placeholder="Steel"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-white text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block">Label</label>
                  <input
                    type="text"
                    value={settings.hero_featured_metric2_lbl || "Lever Cast"}
                    onChange={(e) => handleChange("hero_featured_metric2_lbl", e.target.value)}
                    placeholder="Lever Cast"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#E31E2F] block">Spec 3 / Price</span>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block">Value</label>
                  <input
                    type="text"
                    value={settings.hero_featured_metric3_val || "₹4,200"}
                    onChange={(e) => handleChange("hero_featured_metric3_val", e.target.value)}
                    placeholder="₹4,200"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-white text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-500 uppercase block">Label</label>
                  <input
                    type="text"
                    value={settings.hero_featured_metric3_lbl || "From"}
                    onChange={(e) => handleChange("hero_featured_metric3_lbl", e.target.value)}
                    placeholder="From"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#1f1f1f] border border-[#333] text-white text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1e1e1e]">
            <div>
              <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Button CTA Label
              </label>
              <input
                type="text"
                value={settings.hero_featured_btn_text || "VIEW LEVER BELTS"}
                onChange={(e) => handleChange("hero_featured_btn_text", e.target.value)}
                placeholder="VIEW LEVER BELTS"
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Button Target Link / URL
              </label>
              <input
                type="text"
                value={settings.hero_featured_btn_url || "/shop/gym-belts"}
                onChange={(e) => handleChange("hero_featured_btn_url", e.target.value)}
                placeholder="/shop/gym-belts"
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white font-mono text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Homepage Animated Marquee Ticker */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E31E2F]" />
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
                HOMEPAGE ANIMATED MARQUEE TEXT
              </h2>
            </div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Scroll-Animated Ticker</span>
          </div>

          <p className="text-neutral-400 text-xs leading-relaxed">
            This bold athletic ticker animates smoothly left-to-right beneath the hero and trust strip on the landing page, repeating your brand name across the screen.
          </p>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Marquee Primary Line (Animated Left-to-Right)
            </label>
            <input
              type="text"
              value={settings.marquee_line1_text || "THE FITNESS STORE"}
              onChange={(e) => handleChange("marquee_line1_text", e.target.value)}
              placeholder="THE FITNESS STORE"
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Repeated continuously with red athletic divider dots moving left-to-right.
            </p>
          </div>

          <div>
            <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Marquee Secondary Line (Stylized Outline Text)
            </label>
            <input
              type="text"
              value={
                settings.marquee_line2_text ||
                "THE FITNESS STORE · BUILT FOR EVERY REP · PERFORMANCE EQUIPMENT"
              }
              onChange={(e) => handleChange("marquee_line2_text", e.target.value)}
              placeholder="THE FITNESS STORE · BUILT FOR EVERY REP · PERFORMANCE EQUIPMENT"
              className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-neutral-400"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Rendered in stylized outline typographic stroke gliding in parallel.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
