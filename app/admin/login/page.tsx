"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TFSLogo } from "@/components/brand/tfs-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Check your credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@thefitnessstore.com");
    setPassword("Admin@TFS2026Secure");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#080808] flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle align="right" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo & Heading */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <TFSLogo size="lg" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-3xl uppercase tracking-wider text-neutral-900 dark:text-white">
              ADMIN CONTROL PANEL
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Sign in with authorized administrator credentials
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#262626] p-8 shadow-xl dark:shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thefitnessstore.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-[#2d2d2d] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                />
                <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#181818] border border-neutral-300 dark:border-[#2d2d2d] text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#E31E2F]"
                />
                <Lock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] active:scale-[0.99] font-display text-lg uppercase tracking-wider text-white transition-all red-glow flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg mt-2"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoading ? "VERIFYING..." : "ENTER DASHBOARD"}</span>
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-4 border-t border-neutral-200 dark:border-[#1e1e1e] text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline cursor-pointer"
            >
              Quick-fill default seeded admin credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
