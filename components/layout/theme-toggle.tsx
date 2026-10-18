"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, ThemeMode } from "@/context/theme-context";

interface ThemeToggleProps {
  variant?: "dropdown" | "segmented";
  className?: string;
  align?: "left" | "right";
}

export function ThemeToggle({
  variant = "dropdown",
  className = "",
  align = "right",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const options: { mode: ThemeMode; label: string; icon: React.ElementType }[] = [
    { mode: "system", label: "System", icon: Monitor },
    { mode: "light", label: "Light", icon: Sun },
    { mode: "dark", label: "Dark", icon: Moon },
  ];

  // Active icon based on current mode
  const ActiveIcon = !mounted
    ? Monitor
    : theme === "system"
    ? Monitor
    : theme === "light"
    ? Sun
    : Moon;

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-[#141414] border border-neutral-300 dark:border-[#262626] ${className}`}
        role="radiogroup"
        aria-label="Select color theme"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = mounted && theme === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#E31E2F] text-white shadow-sm font-bold"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-[#1f1f1f]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 min-[360px]:p-2 sm:p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-[#181818] border border-transparent hover:border-neutral-300 dark:hover:border-[#2a2a2a] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31E2F] cursor-pointer"
        aria-label={`Theme settings. Current: ${theme} mode`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to change)`}
      >
        <ActiveIcon className="w-4 h-4 min-[360px]:w-4.5 min-[360px]:h-4.5 sm:w-5 sm:h-5 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-label="Theme options"
          className={`absolute top-full mt-2 w-40 rounded-xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-[#282828] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-[#222] mb-1">
            Theme
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = mounted && theme === opt.mode;
            return (
              <button
                key={opt.mode}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  setTheme(opt.mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#E31E2F]/10 text-[#E31E2F] dark:text-[#ff4d5a] font-semibold"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#1e1e1e] hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#E31E2F]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
