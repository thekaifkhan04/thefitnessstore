import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | THE FITNESS STORE (TFS)",
    default: "THE FITNESS STORE (TFS) — Retailer & Wholesaler of Sports & Gym Equipment",
  },
  description:
    "Explore India's premier fitness store for commercial gym equipment, powerlifting lever belts, dumbbells, plates, athletic wear, supplements, and accessories. Direct WhatsApp ordering & wholesale supply.",
  keywords: [
    "fitness store",
    "gym equipment wholesale",
    "powerlifting lever belt",
    "dumbbells",
    "technosport trackpant",
    "rubber weight plates",
    "supplements",
    "shakers",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "THE FITNESS STORE (TFS)",
    description: "Quality gym equipment, accessories, apparel, and fitness essentials. Order directly on WhatsApp.",
    siteName: "THE FITNESS STORE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-[#080808] text-white flex flex-col font-sans antialiased selection:bg-[#E31E2F] selection:text-white">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <FloatingWhatsApp />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
