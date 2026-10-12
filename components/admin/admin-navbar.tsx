"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TFSLogoEmblem } from "@/components/brand/tfs-logo";
import { useSettings } from "@/context/settings-context";
import {
  LayoutDashboard,
  Package,
  Layers,
  Flame,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AdminNavbar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { settings } = useSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/offers", label: "Offers & Banners", icon: Flame },
    { href: "/admin/orders", label: "Enquiries", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scrollBy = (offset: number) => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScroll, 200);
    }
  };

  return (
    <header className="bg-white dark:bg-[#0b0b0b] border-b border-neutral-200 dark:border-[#222222] sticky top-0 z-50 shadow-sm dark:shadow-md">
      {/* Top Bar: Brand & User Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2.5 shrink-0 group">
            <div className="p-1 rounded bg-neutral-100 dark:bg-[#161616] border border-neutral-200 dark:border-[#262626] group-hover:border-[#E31E2F] transition-colors">
              <TFSLogoEmblem className="w-6 h-6" logoUrl={settings?.store_logo_url} />
            </div>
            <span className="font-display font-extrabold text-lg uppercase tracking-wider text-neutral-900 dark:text-white">
              {settings?.store_name ? (
                <>
                  {settings.store_name} <span className="text-[#E31E2F]">ADMIN</span>
                </>
              ) : (
                <>
                  TFS <span className="text-[#E31E2F]">ADMIN</span>
                </>
              )}
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center space-x-3 text-xs shrink-0">
            {userEmail && (
              <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400 font-mono text-[11px] truncate max-w-[180px]">
                {userEmail}
              </span>
            )}

            <ThemeToggle align="right" />

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-[#141414] hover:bg-neutral-200 dark:hover:bg-[#1e1e1e] border border-neutral-200 dark:border-[#2b2b2b] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-[#141414] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 border border-neutral-200 dark:border-[#2b2b2b] text-neutral-500 dark:text-neutral-400 transition-colors cursor-pointer"
              title="Sign out of Admin"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Bar with Horizontal Controls */}
      <div className="border-t border-neutral-200 dark:border-[#1a1a1a] bg-neutral-50/95 dark:bg-[#0e0e0e]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center relative">
          {/* Scroll Left Button (shown if scrolled right) */}
          {canScrollLeft && (
            <button
              onClick={() => scrollBy(-150)}
              className="absolute left-1 z-10 p-1.5 rounded-full bg-white dark:bg-black/90 text-neutral-900 dark:text-white border border-neutral-300 dark:border-[#333] hover:border-[#E31E2F] shadow-lg"
              title="Scroll left"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Horizontal Scrollable Tabs Strip */}
          <nav
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-1.5 overflow-x-auto py-2.5 px-2 w-full flex-nowrap scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-[#2c2c2c] hover:scrollbar-thumb-neutral-400 dark:hover:scrollbar-thumb-[#444] scrollbar-track-transparent scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider shrink-0 transition-all ${
                    isActive
                      ? "bg-[#E31E2F] text-white shadow-md red-glow-subtle font-bold"
                      : "bg-white dark:bg-[#141414] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1c1c1c] border border-neutral-200 dark:border-[#242424]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Scroll Right Button (shown if can scroll right) */}
          {canScrollRight && (
            <button
              onClick={() => scrollBy(150)}
              className="absolute right-1 z-10 p-1.5 rounded-full bg-white dark:bg-black/90 text-neutral-900 dark:text-white border border-neutral-300 dark:border-[#333] hover:border-[#E31E2F] shadow-lg"
              title="Scroll right"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
