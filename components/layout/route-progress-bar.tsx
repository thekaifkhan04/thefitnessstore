"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // When pathname or search params update, navigation has finished
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Handle internal relative paths
      if (
        href.startsWith("/") &&
        !href.startsWith("/#") &&
        !target.getAttribute("target") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href !== currentUrl) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div className="h-[3px] bg-[#E31E2F] shadow-[0_0_12px_#E31E2F] animate-pulse w-full" />
    </div>
  );
}
