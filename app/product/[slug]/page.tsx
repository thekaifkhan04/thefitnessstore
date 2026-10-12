import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { ProductCard } from "@/components/product/product-card";
import { ChevronRight, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seoTitle || `${product.name} | THE FITNESS STORE`,
    description: product.seoDescription || product.shortDescription || `Order ${product.name} directly on WhatsApp from THE FITNESS STORE.`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || "",
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      variants: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isAvailable: true,
    },
    include: {
      category: true,
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
      variants: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // Parse specifications into key-value or lines
  const specLines = product.specifications
    ? product.specifications.split("\n").filter((l) => l.trim().length > 0)
    : [];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0]?.url,
    description: product.shortDescription || product.fullDescription,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "THE FITNESS STORE",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.sellingPricePaise / 100).toFixed(2),
      availability: product.isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white pt-24 pb-20">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="py-4 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600" />
          <Link href="/shop" className="hover:text-neutral-900 dark:hover:text-white">Catalogue</Link>
          <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600" />
          <Link href={`/shop/${product.category.slug}`} className="hover:text-neutral-900 dark:hover:text-white">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-400 dark:text-neutral-600" />
          <span className="text-[#E31E2F] font-semibold line-clamp-1">{product.name}</span>
        </div>

        {/* Main Product Interactive View */}
        <ProductDetailView product={product} />

        {/* Specifications & Detailed Info */}
        <div className="mt-16 pt-12 border-t border-neutral-200 dark:border-[#1f1f1f] grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Specifications */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display font-extrabold text-2xl uppercase tracking-wider text-neutral-900 dark:text-white">
              PRODUCT SPECIFICATIONS
            </h2>
            {specLines.length > 0 ? (
              <div className="rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-[#242424] overflow-hidden shadow-sm">
                <div className="divide-y divide-neutral-200 dark:divide-[#1e1e1e]">
                  {specLines.map((line, idx) => {
                    const parts = line.split(":");
                    return (
                      <div
                        key={idx}
                        className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
                      >
                        {parts.length === 2 ? (
                          <>
                            <span className="font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                              {parts[0].trim()}
                            </span>
                            <span className="text-neutral-900 dark:text-white font-medium sm:text-right">
                              {parts[1].trim()}
                            </span>
                          </>
                        ) : (
                          <span className="text-neutral-700 dark:text-neutral-300 font-medium">{line}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Specifications available on enquiry.</p>
            )}
          </div>

          {/* Full Description & Ordering Policy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h2 className="font-display font-extrabold text-2xl uppercase tracking-wider text-neutral-900 dark:text-white">
                ABOUT THIS ITEM
              </h2>
              <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed space-y-3">
                <p>{product.fullDescription || product.shortDescription}</p>
              </div>
            </div>

            {/* WhatsApp Ordering Process Explanation */}
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-[#2b2b2b] space-y-2.5 shadow-sm">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                HOW TO ORDER AT TFS:
              </h3>
              <ol className="list-decimal list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 leading-relaxed">
                <li>Select your desired variant and quantity above.</li>
                <li>Click <strong>&ldquo;Order on WhatsApp&rdquo;</strong> to generate a direct enquiry.</li>
                <li>Our showroom executive confirms live inventory and shipping charge for your location.</li>
                <li>Finalize payment and receive your dispatch tracking details.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200 dark:border-[#1f1f1f] space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E31E2F]">
                  MORE IN THIS CATEGORY
                </span>
                <h3 className="font-display font-extrabold text-3xl uppercase tracking-tight text-neutral-900 dark:text-white mt-1">
                  RELATED GEAR
                </h3>
              </div>
              <Link
                href={`/shop/${product.category.slug}`}
                className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white uppercase tracking-wider"
              >
                View Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.map((p) => (
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
        )}
      </div>
    </div>
  );
}
