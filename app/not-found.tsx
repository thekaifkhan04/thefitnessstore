import React from "react";
import Link from "next/link";
import { Dumbbell, ArrowRight, Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-16 flex flex-col items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-neutral-100 dark:bg-[#141414] border border-neutral-200 dark:border-[#2b2b2b] flex items-center justify-center text-[#E31E2F] shadow-xl">
          <Dumbbell className="w-10 h-10 -rotate-45" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
            ERROR 404 · PAGE NOT FOUND
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-neutral-900 dark:text-white">
            REP OUT OF BOUNDS
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
            The equipment or page you are looking for does not exist or may have been relocated.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-lg uppercase tracking-wider text-white transition-all red-glow flex items-center gap-2 shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>

          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-neutral-100 dark:bg-[#141414] hover:bg-neutral-200 dark:hover:bg-[#1e1e1e] border border-neutral-300 dark:border-[#2b2b2b] font-display text-lg uppercase tracking-wider text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-all flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>BROWSE CATALOGUE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
