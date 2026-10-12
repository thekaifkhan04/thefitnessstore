"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  categoryId: string;
  sellingPriceRupees: number;
  originalPriceRupees: number | "";
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOffer: boolean;
  enquiryType: string;
  shortDescription: string;
  fullDescription: string;
  specifications: string;
  images: string[];
  variants: Array<{
    name: string;
    size?: string;
    weight?: string;
    color?: string;
    priceRupees?: number | "";
    stock: number;
  }>;
}

interface ProductFormProps {
  initialData?: any;
  categories: Category[];
  isEditing?: boolean;
}

export function ProductForm({
  initialData,
  categories,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    id: initialData?.id,
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    sku: initialData?.sku || "",
    brand: initialData?.brand || "TFS Pro",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    sellingPriceRupees: initialData ? initialData.sellingPricePaise / 100 : 999,
    originalPriceRupees: initialData?.originalPricePaise
      ? initialData.originalPricePaise / 100
      : "",
    stock: initialData?.stock ?? 20,
    isAvailable: initialData?.isAvailable ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isNewArrival: initialData?.isNewArrival ?? false,
    isOffer: initialData?.isOffer ?? false,
    enquiryType: initialData?.enquiryType || "BOTH",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    specifications: initialData?.specifications || "",
    images: initialData?.images?.map((img: any) => img.url) || [
      "/images/brand/tfs_logo_emblem.png",
    ],
    variants: initialData?.variants?.map((v: any) => ({
      name: v.name,
      size: v.size || "",
      weight: v.weight || "",
      color: v.color || "",
      priceRupees: v.pricePaise ? v.pricePaise / 100 : "",
      stock: v.stock ?? 10,
    })) || [{ name: "Standard", stock: 15 }],
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-generate slug when name changes
  const handleNameChange = (name: string) => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : generatedSlug,
    }));
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl("");
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, json.url],
        }));
      } else {
        alert(json.error || "Image upload failed");
      }
    } catch {
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: "New Variant", size: "", weight: "", color: "", stock: 10 },
      ],
    }));
  };

  const updateVariant = (idx: number, field: string, val: any) => {
    setFormData((prev) => {
      const copy = [...prev.variants];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, variants: copy };
    });
  };

  const removeVariant = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        brand: formData.brand || null,
        categoryId: formData.categoryId,
        sellingPricePaise: Math.round(Number(formData.sellingPriceRupees) * 100),
        originalPricePaise:
          formData.originalPriceRupees !== ""
            ? Math.round(Number(formData.originalPriceRupees) * 100)
            : null,
        stock: Number(formData.stock),
        isAvailable: formData.isAvailable,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isOffer: formData.isOffer,
        enquiryType: formData.enquiryType,
        shortDescription: formData.shortDescription || null,
        fullDescription: formData.fullDescription || null,
        specifications: formData.specifications || null,
        images: formData.images,
        variants: formData.variants.map((v) => ({
          name: v.name,
          size: v.size || null,
          weight: v.weight || null,
          color: v.color || null,
          pricePaise:
            v.priceRupees !== "" && v.priceRupees !== undefined
              ? Math.round(Number(v.priceRupees) * 100)
              : null,
          stock: Number(v.stock),
        })),
      };

      const endpoint = isEditing
        ? `/api/admin/products/${formData.id}`
        : `/api/admin/products`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save product.");
      } else {
        setSuccess(true);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("tfs:products-updated"));
        }
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 800);
      }
    } catch {
      setError("An unexpected error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-[#141414] hover:bg-[#1e1e1e] border border-[#2b2b2b] text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display font-extrabold text-2xl uppercase tracking-wider text-white">
            {isEditing ? `EDIT PRODUCT: ${formData.name}` : "CREATE NEW PRODUCT"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1e1e1e] border border-[#2b2b2b] text-xs font-semibold uppercase tracking-wider text-neutral-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-base uppercase tracking-wider text-white transition-all red-glow-subtle flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "SAVING..." : "SAVE PRODUCT"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Product saved successfully! Redirecting to catalogue...</span>
        </div>
      )}

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Basic info, descriptions, specs, variants */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Basic Info */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
              GENERAL INFORMATION
            </h2>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Repex Lever Belt Imported 13mm"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-[#2c2c2c] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="repex-lever-belt-13mm"
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  SKU / Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="TFS-BELT-001"
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="Repex / Technosport"
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-[#2c2c2c] text-xs text-white focus:outline-none focus:border-[#E31E2F]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card: Pricing & Stock */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
              PRICING & STOCK
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Selling Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formData.sellingPriceRupees}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sellingPriceRupees: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-sm text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Original Price (₹ MRP Strike)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.originalPriceRupees}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originalPriceRupees:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  placeholder="Optional comparison"
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-sm text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Stock Units *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-sm text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>
            </div>
          </div>

          {/* Card: Descriptions & Specifications */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
              DESCRIPTIONS & SPECIFICATIONS
            </h2>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Short Description (Card summary)
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                placeholder="Brief commercial description of sizes, weights, or features..."
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                value={formData.fullDescription}
                onChange={(e) =>
                  setFormData({ ...formData, fullDescription: e.target.value })
                }
                placeholder="In-depth details, materials, training benefits, and care instructions..."
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                Specifications (Key: Value per line)
              </label>
              <textarea
                rows={4}
                value={formData.specifications}
                onChange={(e) =>
                  setFormData({ ...formData, specifications: e.target.value })
                }
                placeholder="Material: 13mm Full Grain Leather&#10;Buckle: Cast Alloy Steel&#10;Width: 4 Inches (10cm)"
                className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2c2c2c] font-mono text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
              />
            </div>
          </div>

          {/* Card: Variants */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
                PRODUCT VARIANTS (SIZES / WEIGHTS / COLORS)
              </h2>
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1 rounded-lg bg-[#202020] hover:bg-[#282828] text-xs font-semibold text-white flex items-center gap-1.5 border border-[#333333]"
              >
                <Plus className="w-3.5 h-3.5" /> Add Variant
              </button>
            </div>

            <div className="space-y-3">
              {formData.variants.map((variant, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#181818] border border-[#2a2a2a] grid grid-cols-1 sm:grid-cols-6 gap-3 items-center"
                >
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Variant Name (e.g. Size M)"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(idx, "name", e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#121212] border border-[#2f2f2f] text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Size"
                      value={variant.size || ""}
                      onChange={(e) =>
                        updateVariant(idx, "size", e.target.value)
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#121212] border border-[#2f2f2f] text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={variant.priceRupees ?? ""}
                      onChange={(e) =>
                        updateVariant(
                          idx,
                          "priceRupees",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#121212] border border-[#2f2f2f] text-white"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(idx, "stock", Number(e.target.value))
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#121212] border border-[#2f2f2f] text-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Status toggles, image gallery management */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Visibility Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
              STATUS & VISIBILITY
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-[#2a2a2a] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Published / Available</div>
                  <div className="text-[10px] text-neutral-400">Visible to customer shopping</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#E31E2F]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-[#2a2a2a] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Featured Product</div>
                  <div className="text-[10px] text-neutral-400">Highlighted on Homepage</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#E31E2F]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-[#2a2a2a] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">New Arrival</div>
                  <div className="text-[10px] text-neutral-400">Badge as new addition</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) =>
                    setFormData({ ...formData, isNewArrival: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#E31E2F]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-[#2a2a2a] cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Special Deal / Offer</div>
                  <div className="text-[10px] text-neutral-400">Display in Deals section</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isOffer}
                  onChange={(e) =>
                    setFormData({ ...formData, isOffer: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#E31E2F]"
                />
              </label>
            </div>
          </div>

          {/* Product Images Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] space-y-4">
            <h2 className="font-display text-base font-bold uppercase tracking-wider text-white">
              PRODUCT IMAGES
            </h2>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or /images/products/..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#181818] border border-[#2c2c2c] text-white"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-2 rounded-xl bg-[#222222] hover:bg-[#2b2b2b] text-xs font-semibold text-white"
                  >
                    Add
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer py-2 px-3 rounded-xl bg-[#181818] hover:bg-[#202020] border border-dashed border-[#333333] hover:border-neutral-400 text-center text-xs text-neutral-400 hover:text-white transition-colors">
                    <span>{isUploading ? "Uploading file..." : "📁 Upload from Computer (PNG/JPG)"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {formData.images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl bg-[#181818] border border-[#2c2c2c] overflow-hidden group"
                  >
                    <Image
                      src={url}
                      alt={`Product image ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 text-neutral-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </form>
  );
}
