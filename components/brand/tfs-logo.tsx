"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSettings } from "@/context/settings-context";

interface TFSLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  className?: string;
  href?: string;
  logoUrl?: string;
}

export function TFSLogoEmblem({
  className = "w-8 h-8",
  logoUrl,
}: {
  className?: string;
  logoUrl?: string;
}) {
  const [imgError, setImgError] = useState(false);

  // Reset error whenever logoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  if (logoUrl && logoUrl.trim() !== "" && !imgError) {
    return (
      <img
        src={logoUrl}
        alt="Store Logo"
        className={`${className} object-contain`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TFS Emblem"
    >
      {/* T top bar (Silver / Grey) */}
      <path
        d="M5 12H95L86 24H14L5 12Z"
        fill="#C5C7CB"
      />
      {/* F upper wing and stem (Silver) */}
      <path
        d="M52 24H90L82 36H52V52H40V24H52Z"
        fill="#9CA3AF"
      />
      {/* S sharp geometric athletic wing (Brand Crimson Red #E31E2F) */}
      <path
        d="M18 28H48L38 42H16L18 28Z"
        fill="#E31E2F"
      />
      <path
        d="M16 42H76L68 56H38L22 78L12 78L28 56H16V42Z"
        fill="#E31E2F"
      />
      {/* Sharp lower chevron point */}
      <path
        d="M50 88L76 56H62L46 76L38 66L30 76L50 88Z"
        fill="#B91C1C"
      />
    </svg>
  );
}

export function TFSLogo({
  size = "md",
  showWordmark = true,
  className = "",
  href = "/",
  logoUrl: propLogoUrl,
}: TFSLogoProps) {
  const { settings } = useSettings();
  const effectiveLogoUrl = propLogoUrl || settings?.store_logo_url;
  const storeName = settings?.store_name || "THE FITNESS STORE";
  const shouldShowWordmark =
    showWordmark && settings?.store_logo_show_wordmark !== "false";

  const emblemSizes = {
    sm: effectiveLogoUrl ? "h-7 w-auto min-w-[1.75rem] max-w-[9rem]" : "w-7 h-7",
    md: effectiveLogoUrl ? "h-9 w-auto min-w-[2.25rem] max-w-[12rem]" : "w-9 h-9",
    lg: effectiveLogoUrl ? "h-11 w-auto min-w-[2.75rem] max-w-[15rem]" : "w-11 h-11",
    xl: effectiveLogoUrl ? "h-14 w-auto min-w-[3.5rem] max-w-[20rem]" : "w-14 h-14",
  };

  const wordmarkSizes = {
    sm: "text-base tracking-wider",
    md: "text-xl tracking-wider",
    lg: "text-2xl tracking-wider",
    xl: "text-3xl tracking-widest",
  };

  const nameParts = storeName.split(" ");
  const lastName = nameParts.length > 1 ? nameParts.pop() : "";
  const firstName = nameParts.join(" ") || storeName;

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center p-1 rounded bg-white dark:bg-[#111111] border border-neutral-200 dark:border-[#262626] shadow-sm group-hover:border-[#E31E2F] transition-colors shrink-0">
        <TFSLogoEmblem className={emblemSizes[size]} logoUrl={effectiveLogoUrl} />
      </div>
      {shouldShowWordmark && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-extrabold uppercase text-neutral-900 dark:text-white ${wordmarkSizes[size]}`}>
            {firstName} {lastName && <span className="text-[#E31E2F]">{lastName}</span>}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-neutral-500 dark:text-[#A6A6A6] font-medium mt-0.5">
            TFS · SPORTS & FITNESS
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
