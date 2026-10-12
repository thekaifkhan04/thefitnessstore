"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit3, Trash2, Layers, AlertCircle, X, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("/images/brand/tfs_logo_emblem.png");
    setDisplayOrder(categories.length + 1);
    setIsActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setDisplayOrder(cat.displayOrder);
    setIsActive(cat.isActive);
    setError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name,
        slug,
        description: description.trim() || null,
        image: image.trim() || null,
        displayOrder: Number(displayOrder),
        isActive,
      };

      const endpoint = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : `/api/admin/categories`;

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save category.");
      } else {
        setIsModalOpen(false);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("tfs:categories-updated"));
        }
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    const confirmed = window.confirm(`Are you sure you want to delete category "${cat.name}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete category.");
      } else {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("tfs:categories-updated"));
        }
        router.refresh();
      }
    } catch {
      alert("Error deleting category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f]">
        <div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white">
            CATEGORY MANAGEMENT
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Total {categories.length} product categories defined
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-base uppercase tracking-wider text-white transition-all red-glow-subtle flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>NEW CATEGORY</span>
        </button>
      </div>

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-2xl bg-[#121212] border border-[#242424] hover:border-[#383838] transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-14 rounded-xl bg-[#181818] border border-[#282828] overflow-hidden shrink-0">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    <Layers className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white line-clamp-1">{cat.name}</h3>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      cat.isActive
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                        : "bg-neutral-800 text-neutral-500"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  /{cat.slug}
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {cat._count?.products ?? 0} Products
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e1e1e] mt-3 flex items-center justify-between text-xs">
              <span className="text-[10px] text-neutral-500">Order: {cat.displayOrder}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202020] transition-colors"
                  title="Edit category"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#121212] border border-[#282828] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h2 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                {editingCategory ? "EDIT CATEGORY" : "CREATE CATEGORY"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white p-1"
              >
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
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Weightlifting Belts"
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="weightlifting-belts"
                    className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>

                <div>
                  <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/products/repex_lever_belt_13mm.png"
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of items in this category..."
                  className="w-full px-3 py-2 rounded-xl bg-[#181818] border border-[#2d2d2d] text-white focus:outline-none focus:border-[#E31E2F]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#E31E2F]"
                />
                <span className="font-medium text-white">Active (Display in navigation & catalogue)</span>
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
                  <span>{isSubmitting ? "Saving..." : "Save Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
