"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X } from "lucide-react";
import { useSettings } from "@/context/settings-context";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const { settings, getWhatsAppUrl } = useSettings();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const whatsappUrl = getWhatsAppUrl(
    `Hello ${settings.store_name}! I have a question about product availability and ordering.`
  );

  return (
    <div className="fixed bottom-6 right-6 z-30 flex items-center gap-3">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-[#2d2d2d] rounded-xl text-xs text-neutral-900 dark:text-white shadow-xl animate-in fade-in slide-in-from-right-3 duration-200">
          <span>Need help or wholesale price? Chat with us!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating CTA Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-2xl hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all cursor-pointer group"
        aria-label="Contact THE FITNESS STORE on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-white text-white group-hover:scale-110 transition-transform" />
      </a>
    </div>
  );
}
