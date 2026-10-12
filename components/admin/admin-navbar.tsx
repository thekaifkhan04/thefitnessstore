"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TFSLogoEmblem } from "@/components/brand/tfs-logo";
import {
  LayoutDashboard,
  Package,
  Layers,
  Flame,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";

export function AdminNavbar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <header className="bg-[#0b0b0b] border-b border-[#222222] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="p-1 rounded bg-[#161616] border border-[#262626]">
                <TFSLogoEmblem className="w-6 h-6" />
              </div>
              <span className="font-display font-extrabold text-lg uppercase tracking-wider text-white">
                TFS <span className="text-[#E31E2F]">ADMIN</span>
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/admin" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-[#1f1f1f] text-white border-b-2 border-[#E31E2F]"
                        : "text-neutral-400 hover:text-white hover:bg-[#151515]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3 text-xs">
            {userEmail && (
              <span className="hidden lg:inline text-neutral-400 font-mono text-[11px]">
                {userEmail}
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1e1e1e] border border-[#2b2b2b] text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-[#141414] hover:bg-red-950/40 hover:text-red-400 border border-[#2b2b2b] text-neutral-400 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav row */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-[#1a1a1a]">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider shrink-0 ${
                  isActive
                    ? "bg-[#E31E2F] text-white"
                    : "bg-[#141414] text-neutral-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
