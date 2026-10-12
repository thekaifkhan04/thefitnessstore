"use client";

import React, { useState } from "react";
import { MessageSquare, Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { useSettings } from "@/context/settings-context";

export default function ContactPage() {
  const { settings, getWhatsAppUrl } = useSettings();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");

  const handleWhatsAppContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const message = [
      `Hello ${settings.store_name}!`,
      ``,
      name ? `Name: ${name}` : null,
      phone ? `Phone: ${phone}` : null,
      ``,
      `Message / Query:`,
      query.trim(),
      ``,
      `Please let me know availability and pricing. Thank you!`,
    ].filter(Boolean).join("\n");

    window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  };

  const directChatUrl = getWhatsAppUrl(
    `Hello ${settings.store_name}! I have a general query regarding product stock.`
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-[#1f1f1f] text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31E2F]/15 border border-[#E31E2F]/40 text-[#E31E2F] text-xs font-bold uppercase tracking-wider">
            <span>GET IN TOUCH</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-white leading-tight">
            CONTACT THE TEAM
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            Have questions about product sizing, bulk order rates, or delivery to your pincode? Reach out via WhatsApp or visit our showroom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 my-12 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">
              STORE DETAILS
            </h2>

            <div className="space-y-4">
              <a
                href={directChatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#141414] border border-[#262626] hover:border-[#25D366] flex items-start gap-4 transition-all group"
              >
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-[#25D366] shrink-0 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                    <span>Direct WhatsApp Chat</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">Fastest</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Click to start an immediate chat with our store manager.
                  </p>
                </div>
              </a>

              <div className="p-5 rounded-2xl bg-[#141414] border border-[#262626] flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-[#E31E2F] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Phone Support</h3>
                  <p className="text-xs text-neutral-300 mt-1 font-mono">{settings.contact_phone || "+91 98765 43210"}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Mon – Sat: 10:00 AM – 8:30 PM</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-[#262626] flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-[#E31E2F] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Email Address</h3>
                  <p className="text-xs text-neutral-300 mt-1 font-mono">{settings.support_email || "support@thefitnessstore.com"}</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">For B2B proposals & supplier enquiries</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#141414] border border-[#262626] flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-[#E31E2F] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Showroom & Warehouse</h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    {settings.store_address || "Shop 12, Prime Fitness Hub, Commercial Plaza, India"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#131313] border border-[#292929] p-8 sm:p-10 shadow-2xl">
              <h2 className="font-display font-extrabold text-3xl uppercase tracking-wider text-white mb-2">
                SEND A MESSAGE
              </h2>
              <p className="text-xs text-neutral-400 mb-8">
                Send your question or feedback. We will connect with you via WhatsApp immediately.
              </p>

              <form onSubmit={handleWhatsAppContact} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aman Verma"
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Phone Number
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
                    Message or Product Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe what product or information you need..."
                    className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#2e2e2e] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-xl uppercase tracking-wider text-white transition-all red-glow flex items-center justify-center gap-3 cursor-pointer shadow-xl mt-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>START CHAT ON WHATSAPP</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
