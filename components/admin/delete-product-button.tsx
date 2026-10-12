"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${productName}" from the catalogue?`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } catch {
      alert("Error deleting product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50"
      title="Delete product"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
