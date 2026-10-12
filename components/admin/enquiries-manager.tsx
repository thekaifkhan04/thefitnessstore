"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  MessageSquare,
  Clock,
  Trash2,
  ExternalLink,
  ChevronDown,
  Phone,
  User,
  ShoppingBag,
} from "lucide-react";

interface EnquiryItem {
  id: string;
  productName: string;
  productSku: string | null;
  variantName: string | null;
  quantity: number;
  unitPricePaise: number;
  subtotalPaise: number;
}

interface OrderEnquiry {
  id: string;
  reference: string;
  customerName: string | null;
  customerPhone: string | null;
  customerNote: string | null;
  status: string;
  totalAmountPaise: number;
  itemsCount: number;
  createdAt: Date | string;
  items: EnquiryItem[];
}

const STATUS_OPTIONS = [
  { value: "ENQUIRY_INITIATED", label: "Enquiry Initiated", color: "bg-blue-950/60 text-blue-400 border-blue-800" },
  { value: "CONTACTED", label: "Customer Contacted", color: "bg-purple-950/60 text-purple-400 border-purple-800" },
  { value: "CONFIRMED", label: "Confirmed on WhatsApp", color: "bg-emerald-950/60 text-emerald-400 border-emerald-800" },
  { value: "COMPLETED", label: "Delivered / Completed", color: "bg-teal-950/60 text-teal-400 border-teal-800" },
  { value: "CANCELLED", label: "Cancelled / Out of Stock", color: "bg-neutral-800 text-neutral-400 border-neutral-700" },
];

export function EnquiriesManager({ initialEnquiries }: { initialEnquiries: OrderEnquiry[] }) {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update enquiry status");
      }
    } catch {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id: string, ref: string) => {
    if (!window.confirm(`Delete enquiry record ${ref}?`)) return;
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete enquiry");
      }
    } catch {
      alert("Error deleting enquiry");
    }
  };

  const filtered = initialEnquiries.filter((enq) => {
    if (filterStatus === "ALL") return true;
    return enq.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1f1f1f]">
        <div>
          <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white">
            WHATSAPP ORDER ENQUIRIES
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track customer enquiries initiated from the shopping cart. Statuses are updated manually by store staff.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-xl font-semibold uppercase tracking-wider transition-colors shrink-0 ${
              filterStatus === "ALL"
                ? "bg-[#E31E2F] text-white"
                : "bg-[#141414] text-neutral-400 hover:text-white border border-[#262626]"
            }`}
          >
            All ({initialEnquiries.length})
          </button>
          {STATUS_OPTIONS.map((opt) => {
            const count = initialEnquiries.filter((e) => e.status === opt.value).length;
            return (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`px-3 py-1.5 rounded-xl font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                  filterStatus === opt.value
                    ? "bg-[#E31E2F] text-white"
                    : "bg-[#141414] text-neutral-400 hover:text-white border border-[#262626]"
                }`}
              >
                {opt.label.split(" ")[0]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiry Cards */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#121212] border border-[#222222] text-neutral-500 text-xs">
          No order enquiries found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => {
            const currentOpt = STATUS_OPTIONS.find((o) => o.value === enq.status) || STATUS_OPTIONS[0];
            return (
              <div
                key={enq.id}
                className="p-6 rounded-2xl bg-[#121212] border border-[#242424] hover:border-[#333333] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e1e1e]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white text-sm bg-neutral-900 px-3 py-1 rounded-lg border border-[#2c2c2c]">
                      {enq.reference}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${currentOpt.color}`}>
                      {currentOpt.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{new Date(enq.createdAt).toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => handleDelete(enq.id, enq.reference)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Customer and Note */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                      CUSTOMER
                    </span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{enq.customerName || "Anonymous Shopper"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                      PHONE / WHATSAPP
                    </span>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{enq.customerPhone || "Not specified in form"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                      NOTE / PINCODE
                    </span>
                    <div className="text-neutral-300">
                      {enq.customerNote || "None provided"}
                    </div>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-2">
                    ITEMS REQUESTED ({enq.itemsCount} TOTAL QUANTITY)
                  </span>

                  <div className="divide-y divide-[#1c1c1c] rounded-xl bg-[#171717] border border-[#222222] overflow-hidden">
                    {enq.items.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-2.5 flex items-center justify-between text-xs text-neutral-300"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-white">
                            {item.productName}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {item.productSku ? `Code: ${item.productSku} · ` : ""}
                            {item.variantName ? `Variant: ${item.variantName}` : "Standard"}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-neutral-400">
                            Qty: <strong className="text-white">{item.quantity}</strong> &times; {formatINR(item.unitPricePaise)}
                          </div>
                          <div className="font-display text-sm font-bold text-white">
                            {formatINR(item.subtotalPaise)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotal & Status Action */}
                <div className="pt-3 border-t border-[#1e1e1e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-neutral-400">Enquiry Estimated Total:</span>
                    <span className="font-display text-2xl font-bold text-white">
                      {formatINR(enq.totalAmountPaise)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">Update Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2f2f2f] text-xs text-white focus:outline-none focus:border-[#E31E2F]"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
