import type { Metadata } from "next";
import { Bebas_Neue, Inter, Oswald, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { SettingsProvider } from "@/context/settings-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { getStoreSettings } from "@/lib/settings";

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

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
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

const FONT_MAP: Record<string, string> = {
  bebas: "var(--font-bebas), 'Bebas Neue', Impact, sans-serif",
  oswald: "var(--font-oswald), 'Oswald', sans-serif",
  inter: "var(--font-inter), 'Inter', sans-serif",
  montserrat: "var(--font-montserrat), 'Montserrat', sans-serif",
  impact: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();
  const primaryColor = settings.theme_primary_color || "#E31E2F";
  const textColor = settings.theme_text_color || "#FFFFFF";
  const mutedTextColor = settings.theme_muted_text_color || "#A6A6A6";
  const headingFont = FONT_MAP[settings.theme_heading_font] || FONT_MAP.bebas;
  const headingStyle = settings.theme_heading_style || "uppercase";

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} ${oswald.variable} ${montserrat.variable} dark`}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand-primary: ${primaryColor};
                --brand-red: ${primaryColor};
                --text-primary: ${textColor};
                --text-secondary: ${mutedTextColor};
              }
              body {
                color: var(--text-primary) !important;
              }
              .text-white {
                color: var(--text-primary) !important;
              }
              .text-neutral-400, .text-neutral-300, .text-neutral-500 {
                color: var(--text-secondary) !important;
              }
              .font-display {
                font-family: ${headingFont} !important;
                text-transform: ${headingStyle} !important;
              }
              .bg-\\[\\#E31E2F\\] { background-color: var(--brand-primary) !important; }
              .bg-\\[\\#E31E2F\\] .text-white, .bg-\\[\\#E31E2F\\] * { color: #ffffff !important; }
              .text-\\[\\#E31E2F\\] { color: var(--brand-primary) !important; }
              .border-\\[\\#E31E2F\\] { border-color: var(--brand-primary) !important; }
              .hover\\:bg-\\[\\#c51826\\]:hover { filter: brightness(0.85); }
              .hover\\:text-\\[\\#E31E2F\\]:hover { color: var(--brand-primary) !important; }
              .hover\\:border-\\[\\#E31E2F\\]:hover { border-color: var(--brand-primary) !important; }
              .accent-\\[\\#E31E2F\\] { accent-color: var(--brand-primary) !important; }
              ::selection { background-color: var(--brand-primary) !important; color: #ffffff !important; }
              .red-glow { box-shadow: 0 0 25px ${primaryColor}55 !important; }
              .red-glow-subtle { box-shadow: 0 0 15px ${primaryColor}26 !important; }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#080808] text-white flex flex-col font-sans antialiased selection:bg-[#E31E2F] selection:text-white">
        <SettingsProvider initialSettings={settings}>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <FloatingWhatsApp />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
