import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import {
  ArrowRight,
  ShieldCheck,
  Dumbbell,
  PackageCheck,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";

export const revalidate = 60; // ISR cache revalidation every minute

export default async function HomePage() {
  // Query data from PostgreSQL
  const [categories, featuredProducts, banners, offers] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      take: 12,
    }),
    prisma.product.findMany({
      where: { isAvailable: true, isFeatured: true },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
        variants: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.homepageBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.offer.findMany({
      where: { isActive: true },
      take: 2,
    }),
  ]);

  const wholesaleWhatsAppUrl = buildWhatsAppUrl(
    "Hello THE FITNESS STORE! I am interested in wholesale/bulk commercial fitness equipment pricing and catalogue."
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#080808] text-white">
      {/* SECTION B: HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Cinematic dark fitness background overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/85 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/80 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent z-10" />
          {/* Subtle geometric grid backdrop */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Athletic Headlines */}
            <div className="lg:col-span-8 space-y-6">
              {/* Eyebrow with red accent bar */}
              <div className="inline-flex items-center gap-3">
                <div className="w-10 h-1 bg-[#E31E2F] rounded-full" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#E31E2F]">
                  BUILT FOR EVERY REP · RETAIL & WHOLESALE
                </span>
              </div>

              {/* Oversized Athletic Headline */}
              <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.92] text-white">
                YOUR TRAINING. <br />
                YOUR EQUIPMENT. <br />
                YOUR <span className="text-[#E31E2F] underline decoration-2 decoration-[#E31E2F]/40 underline-offset-8">LIMITS.</span>
              </h1>

              {/* Description */}
              <p className="text-neutral-300 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
                From everyday gym essentials to performance-driven equipment, find everything you need to train harder. We equip passionate athletes, home gyms, and commercial fitness centers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/shop"
                  className="px-8 py-4 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-xl uppercase tracking-wider text-white transition-all duration-200 red-glow flex items-center gap-3 shadow-lg hover:translate-y-[-2px]"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#categories"
                  className="px-7 py-4 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2d2d2d] hover:border-neutral-500 font-display text-xl uppercase tracking-wider text-neutral-200 hover:text-white transition-all flex items-center gap-2"
                >
                  EXPLORE CATEGORIES
                </a>
              </div>
            </div>

            {/* Right Column: Hero Showcase Card inspired by RYNOX Next Up card */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl bg-[#121212]/90 border border-[#262626] p-6 backdrop-blur-xl shadow-2xl hover:border-[#383838] transition-all">
                {/* Pill tag */}
                <div className="inline-block px-3 py-1 rounded-full bg-[#E31E2F] text-white text-[11px] font-bold uppercase tracking-wider mb-4">
                  FEATURED CATEGORY
                </div>

                <h3 className="font-display text-3xl font-bold uppercase text-white tracking-wide">
                  IPF-SPEC LEVER BELTS
                </h3>
                <p className="text-xs text-neutral-400 mt-1 mb-4">
                  13MM & 11MM HEAVY-DUTY GENUINE LEATHER · STEEL LEVER MECHANISM
                </p>

                {/* Metrics strip inside card */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#222222] text-center my-4">
                  <div className="bg-[#181818] p-2.5 rounded-lg border border-[#242424]">
                    <div className="font-display text-2xl text-white font-bold">13mm</div>
                    <div className="text-[10px] text-neutral-400 uppercase">IPF Spec</div>
                  </div>
                  <div className="bg-[#181818] p-2.5 rounded-lg border border-[#242424]">
                    <div className="font-display text-2xl text-white font-bold">Steel</div>
                    <div className="text-[10px] text-neutral-400 uppercase">Lever Cast</div>
                  </div>
                  <div className="bg-[#181818] p-2.5 rounded-lg border border-[#242424]">
                    <div className="font-display text-2xl text-[#E31E2F] font-bold">₹4,200</div>
                    <div className="text-[10px] text-neutral-400 uppercase">From</div>
                  </div>
                </div>

                <Link
                  href="/shop/gym-belts"
                  className="w-full py-3 px-4 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] text-white font-display text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-colors mt-2"
                >
                  <span>VIEW LEVER BELTS</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: TRUST STRIP */}
      <section className="border-y border-[#1f1f1f] bg-[#0c0c0c] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide">
                17+
              </div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Product Categories
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 border-l border-[#222222] pl-4">
              <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide">
                100%
              </div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Verified Fitness Goods
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 border-l border-[#222222] pl-4">
              <div className="font-display text-3xl sm:text-4xl font-bold text-[#E31E2F] tracking-wide">
                B2B & B2C
              </div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Retail & Wholesale Enquiries
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 border-l border-[#222222] pl-4">
              <div className="font-display text-3xl sm:text-4xl font-bold text-emerald-400 tracking-wide">
                DIRECT
              </div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                WhatsApp Order Enquiry
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TYPOGRAPHIC MARQUEE STRIP inspired by RYNOX */}
      <section className="py-8 bg-[#080808] overflow-hidden select-none border-b border-[#181818]">
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex items-center gap-8 text-4xl sm:text-6xl font-display font-extrabold uppercase tracking-widest animate-none text-neutral-200">
            <span>RUN</span>
            <span className="text-[#E31E2F]">·</span>
            <span className="text-[#E31E2F]">LIFT</span>
            <span className="text-[#E31E2F]">·</span>
            <span>CARRY</span>
            <span className="text-[#E31E2F]">·</span>
            <span className="text-[#E31E2F]">FLIP</span>
            <span className="text-[#E31E2F]">·</span>
            <span>REPEAT</span>
            <span className="text-[#E31E2F]">·</span>
            <span className="text-[#E31E2F]">OUTLAST</span>
            <span className="text-[#E31E2F]">·</span>
            <span>TRAIN</span>
            <span className="text-[#E31E2F]">·</span>
            <span className="text-[#E31E2F]">CONQUER</span>
          </div>
        </div>
        <div className="flex whitespace-nowrap overflow-hidden mt-2">
          <div className="flex items-center gap-8 text-4xl sm:text-6xl font-display font-extrabold uppercase tracking-widest text-stroke">
            <span>ENDURANCE</span>
            <span>·</span>
            <span>STRENGTH</span>
            <span>·</span>
            <span>PERFORMANCE</span>
            <span>·</span>
            <span>POWER</span>
            <span>·</span>
            <span>DISCIPLINE</span>
            <span>·</span>
            <span>PRECISION</span>
          </div>
        </div>
      </section>

      {/* SECTION D: SHOP BY CATEGORY */}
      <section id="categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-6 h-1 bg-[#E31E2F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
                CATALOGUE EXPLORER
              </span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-sm font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#E31E2F] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="group relative flex flex-col rounded-xl bg-[#121212] border border-[#222222] hover:border-[#E31E2F]/60 overflow-hidden transition-all duration-300 hover:translate-y-[-3px] hover:shadow-xl"
            >
              <div className="relative aspect-square bg-[#171717] overflow-hidden p-3 flex items-center justify-center">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <Dumbbell className="w-10 h-10 text-neutral-600" />
                )}
              </div>
              <div className="p-3 text-center border-t border-[#1e1e1e]">
                <h3 className="font-display text-sm font-bold uppercase text-white group-hover:text-[#E31E2F] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Explore &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION E: FEATURED PRODUCTS */}
      <section className="py-20 bg-[#0c0c0c] border-y border-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="w-6 h-1 bg-[#E31E2F]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
                  TOP PICKS
                </span>
              </div>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
                FEATURED PRODUCTS
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-lg bg-[#181818] border border-[#2d2d2d] hover:border-[#E31E2F] text-xs font-semibold uppercase tracking-wider text-neutral-200 hover:text-white transition-all flex items-center gap-2"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  sku: p.sku,
                  brand: p.brand,
                  sellingPricePaise: p.sellingPricePaise,
                  originalPricePaise: p.originalPricePaise,
                  isAvailable: p.isAvailable,
                  categoryName: p.category.name,
                  categorySlug: p.category.slug,
                  imageUrl: p.images[0]?.url,
                  variantCount: p.variants.length,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: SHOP BY GOAL & EQUIPMENT TYPE */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 mb-2 justify-center">
            <div className="w-6 h-1 bg-[#E31E2F]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
              TRAINING GOALS
            </span>
            <div className="w-6 h-1 bg-[#E31E2F]" />
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
            EQUIP YOUR DISCIPLINE
          </h2>
          <p className="text-neutral-400 text-sm mt-3">
            Hand-curated equipment sets tailored for serious strength athletes, functional fitness, and commercial fitness centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Powerlifting Belts & Strength */}
          <div className="group relative rounded-2xl bg-[#121212] border border-[#242424] hover:border-[#E31E2F] p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
                STRENGTH ESSENTIALS
              </span>
              <h3 className="font-display text-3xl font-extrabold uppercase text-white leading-tight">
                LEVER BELTS & WRIST WRAPS
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                IPF-spec 13mm leather lever belts, thumb loop wraps, and heavy-duty joint supports built for PRs.
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/shop/gym-belts"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#E31E2F] transition-colors"
              >
                <span>EXPLORE GEAR</span> &rarr;
              </Link>
            </div>
          </div>

          {/* Card 2: Commercial Equipment */}
          <div className="group relative rounded-2xl bg-[#161616] border border-[#242424] hover:border-[#E31E2F] p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden red-glow-subtle">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                COMMERCIAL GRADE
              </span>
              <h3 className="font-display text-3xl font-extrabold uppercase text-white leading-tight">
                FLAT BENCHES & DEADLIFT PLATFORMS
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                50mm heavy-duty platforms, bumper stands, and competition benches for commercial facilities.
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/shop/gym-equipment"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#E31E2F] transition-colors"
              >
                <span>VIEW GYM EQUIPMENT</span> &rarr;
              </Link>
            </div>
          </div>

          {/* Card 3: Free Weights */}
          <div className="group relative rounded-2xl bg-[#121212] border border-[#242424] hover:border-[#E31E2F] p-8 flex flex-col justify-between transition-all duration-300 overflow-hidden">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
                FREE WEIGHTS
              </span>
              <h3 className="font-display text-3xl font-extrabold uppercase text-white leading-tight">
                DUMBBELLS, PLATES & BARBELLS
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                High-density rubber bouncers, 28mm plates, and precision threaded curl & straight rods.
              </p>
            </div>
            <div className="pt-8">
              <Link
                href="/shop/dumbbells"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#E31E2F] transition-colors"
              >
                <span>EXPLORE WEIGHTS</span> &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G: PROMOTIONAL OFFER BANNER */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-red-950/60 via-[#1a0809] to-[#121212] border border-red-900/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E31E2F] text-white text-[11px] font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              <span>LIMITED OFFER</span>
            </div>
            <h3 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              FLAT 15% OFF ON LEVER BELTS
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Use code <span className="font-mono font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-white/20">TFSBELT15</span> when ordering via WhatsApp. Direct wholesale rates on imported 13mm and 11mm lever belts.
            </p>
            <div className="pt-2">
              <Link
                href="/shop/gym-belts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-lg uppercase tracking-wider text-white transition-all shadow-md"
              >
                <span>EXPLORE LEVER BELTS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: WHY THE FITNESS STORE? */}
      <section className="py-20 bg-[#0c0c0c] border-t border-[#1c1c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-2 justify-center">
              <div className="w-6 h-1 bg-[#E31E2F]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
                THE TFS STANDARD
              </span>
              <div className="w-6 h-1 bg-[#E31E2F]" />
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
              WHY THE FITNESS STORE?
            </h2>
            <p className="text-neutral-400 text-sm mt-3">
              We provide athletes and gym owners with commercial-grade fitness goods and transparent direct communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-[#E31E2F]">
                <PackageCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl uppercase font-bold text-white">
                VERIFIED INVENTORY
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every trackpant, belt, dumbell, and accessory is physically stocked and inspected in our facility prior to dispatch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-[#E31E2F]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl uppercase font-bold text-white">
                RETAIL & WHOLESALE
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Whether you need a single 13mm lever belt or 50 pairs of bouncer dumbbells to equip a commercial club, we offer tier pricing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-[#E31E2F]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl uppercase font-bold text-white">
                DIRECT WHATSAPP CONFIRMATION
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                No automated payment gateways or lost packages. Chat directly with the store management to confirm sizes, stock, and local delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: WHOLESALE CTA */}
      <section className="py-20 bg-[#080808] border-t border-[#1c1c1c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E31E2F]">
            COMMERCIAL SUPPLY & BULK ORDERS
          </span>
          <h2 className="font-display font-extrabold text-5xl sm:text-6xl uppercase tracking-tight text-white leading-tight">
            BUY FOR YOUR GYM. <br />
            EQUIP YOUR BUSINESS.
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Looking for fitness equipment in bulk? Contact our team to discuss product availability and wholesale enquiries.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={wholesaleWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-[#E31E2F] hover:bg-[#c51826] font-display text-xl uppercase tracking-wider text-white transition-all red-glow flex items-center gap-3 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 text-white" />
              <span>ENQUIRE ON WHATSAPP</span>
            </a>
            <Link
              href="/bulk-orders"
              className="px-8 py-4 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2c2c2c] text-neutral-200 hover:text-white font-display text-xl uppercase tracking-wider transition-colors"
            >
              WHOLESALE DETAILS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
