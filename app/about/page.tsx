import React from "react";
import Link from "next/link";
import { TFSLogo } from "@/components/brand/tfs-logo";
import { Dumbbell, ShieldCheck, Target, Award, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about THE FITNESS STORE (TFS) — leading retailer & wholesaler of sports and fitness equipment in India.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 border-b border-neutral-200 dark:border-[#1f1f1f] text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31E2F]/15 border border-[#E31E2F]/40 text-[#E31E2F] text-xs font-bold uppercase tracking-wider">
            <span>ABOUT TFS</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl uppercase tracking-tight text-neutral-900 dark:text-white leading-tight">
            THE FITNESS STORE
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
            Wholesaler & Retailer of Sports & Fitness Goods. Built for gym owners, powerlifters, athletes, and dedicated lifters.
          </p>
        </div>

        <div className="my-16 max-w-4xl mx-auto space-y-12">
          {/* Brand Story */}
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] space-y-6">
            <h2 className="font-display font-bold text-3xl uppercase tracking-wider text-neutral-900 dark:text-white">
              OUR MISSION & PURPOSE
            </h2>
            <div className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
              <p>
                At <strong>THE FITNESS STORE (TFS)</strong>, we bridge the gap between heavy commercial equipment manufacturers and the athletes who demand durability. Starting as a specialized sports goods wholesaler, TFS has grown into a trusted destination for serious fitness gear across India.
              </p>
              <p>
                From IPF-spec 13mm leather lever belts and bouncer dumbbells to Technosport breathable trackpants and high-protein Myfitness peanut butters, our inventory is physically stocked, tested, and verified before customer delivery.
              </p>
              <p>
                We believe in genuine, human-centric commerce. Instead of impersonal checkout flows, our direct WhatsApp ordering system ensures that every buyer receives tailored advice on sizes, weights, and live shipping options directly from experienced fitness professionals.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-[#242424] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/50 text-[#E31E2F] flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl uppercase font-bold text-neutral-900 dark:text-white">
                COMMERCIAL DURABILITY
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Equipment crafted to withstand 24/7 high-volume punishment in commercial fitness clubs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-[#242424] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-[#E31E2F] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl uppercase font-bold text-neutral-900 dark:text-white">
                NO FAKE PROMISES
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Real photographs, accurate specifications, transparent pricing, and direct stock confirmation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-[#242424] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-[#E31E2F] flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl uppercase font-bold text-neutral-900 dark:text-white">
                WHOLESALE & RETAIL
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Competitive pricing whether you order a single pair of wrist wraps or outfit an entire 5,000 sq ft facility.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-xl uppercase tracking-wider text-white transition-all shadow-xl red-glow"
            >
              <span>EXPLORE THE CATALOGUE</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
