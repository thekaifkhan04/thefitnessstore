import type { Metadata } from "next";
import { Bebas_Neue, Inter, Oswald, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { SettingsProvider } from "@/context/settings-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { RouteProgressBar } from "@/components/layout/route-progress-bar";
import { ThemeProvider } from "@/context/theme-context";
import { getStoreSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      select: { name: true, slug: true },
    }),
  ]);
  const primaryColor = settings.theme_primary_color || "#E31E2F";
  const textColor = settings.theme_text_color || "#FFFFFF";
  const mutedTextColor = settings.theme_muted_text_color || "#A6A6A6";
  const headingFont = FONT_MAP[settings.theme_heading_font] || FONT_MAP.bebas;
  const headingStyle = settings.theme_heading_style || "uppercase";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${inter.variable} ${oswald.variable} ${montserrat.variable}`}
    >
      <head>
        <script
          id="tfs-theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('tfs_theme');
                  var isDark = true;
                  if (mode === 'light') {
                    isDark = false;
                  } else if (mode === 'dark') {
                    isDark = true;
                  } else {
                    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                    root.classList.remove('light');
                    root.setAttribute('data-theme', 'dark');
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.add('light');
                    root.classList.remove('dark');
                    root.setAttribute('data-theme', 'light');
                    root.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --brand-primary: ${primaryColor};
                --font-display-custom: ${headingFont};
                --heading-style-custom: ${headingStyle};
              }
              html.dark {
                --brand-primary: ${primaryColor};
                --brand-red: ${primaryColor};
                --text-primary: ${textColor};
                --text-secondary: ${mutedTextColor};
              }
              html.light {
                --brand-primary: ${primaryColor !== "#E31E2F" ? primaryColor : "#D7192D"};
                --brand-red: ${primaryColor !== "#E31E2F" ? primaryColor : "#D7192D"};
                --text-primary: #171717;
                --text-secondary: #60646C;
              }
              body {
                color: var(--text-primary);
                background-color: var(--background);
              }
              .font-display {
                font-family: var(--font-display-custom, ${headingFont}) !important;
                text-transform: var(--heading-style-custom, ${headingStyle}) !important;
              }
              .bg-\\[\\#E31E2F\\] { background-color: var(--brand-primary) !important; }
              .bg-\\[\\#E31E2F\\] .text-white, .bg-\\[\\#E31E2F\\] *, html.light .bg-\\[\\#E31E2F\\] * { color: #ffffff !important; }
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
      <body className="min-h-screen bg-white dark:bg-[#080808] text-neutral-900 dark:text-white flex flex-col font-sans antialiased selection:bg-[#E31E2F] selection:text-white">
        <RouteProgressBar />
        <SettingsProvider initialSettings={settings}>
          <ThemeProvider>
            <CartProvider>
              <Navbar initialCategories={categories} />
              <CartDrawer />
              <FloatingWhatsApp />
              <main className="flex-1">{children}</main>
              <Footer categories={categories} />
            </CartProvider>
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
