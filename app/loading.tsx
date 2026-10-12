import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[85vh] bg-[#080808] text-white pt-24 pb-16 flex flex-col items-center justify-center">
      {/* Top glowing brand animated loading bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E31E2F] to-transparent z-50 animate-pulse" />

      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        {/* Pulsating athletic emblem loader */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-[#E31E2F]/20 animate-ping" />
          <div className="relative w-14 h-14 rounded-2xl bg-[#121212] border border-[#2b2b2b] flex items-center justify-center shadow-2xl">
            <div className="w-6 h-6 border-2 border-[#E31E2F] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-display font-extrabold text-xl uppercase tracking-wider text-white">
            LOADING THE FITNESS STORE
          </h3>
          <p className="text-xs text-neutral-400">
            Fetching verified inventory &amp; product catalogue...
          </p>
        </div>

        {/* Skeleton content preview bars */}
        <div className="w-64 mx-auto space-y-2 pt-2">
          <div className="h-2 bg-[#181818] rounded-full overflow-hidden">
            <div className="h-full bg-[#E31E2F] rounded-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
