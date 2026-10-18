import { prisma } from "@/lib/prisma";

export interface StoreSettingsMap {
  store_name: string;
  store_tagline: string;
  store_logo_url: string;
  theme_primary_color: string;
  whatsapp_number: string;
  support_email: string;
  contact_phone: string;
  store_address: string;
  hero_eyebrow: string;
  hero_headline: string;
  hero_description: string;
  wholesale_banner_headline: string;
  currency_symbol: string;
  instagram_url: string;
  facebook_url: string;
  theme_text_color: string;
  theme_muted_text_color: string;
  theme_heading_font: string;
  theme_heading_style: string;
  hero_featured_badge: string;
  hero_featured_title: string;
  hero_featured_subtitle: string;
  hero_featured_metric1_val: string;
  hero_featured_metric1_lbl: string;
  hero_featured_metric2_val: string;
  hero_featured_metric2_lbl: string;
  hero_featured_metric3_val: string;
  hero_featured_metric3_lbl: string;
  hero_featured_btn_text: string;
  hero_featured_btn_url: string;
  marquee_line1_text: string;
  marquee_line2_text: string;
  marquee_text_color: string;
  store_logo_show_wordmark: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettingsMap = {
  store_name: "THE FITNESS STORE",
  store_tagline: "Wholesaler & Retailer of Sports & Fitness Goods",
  store_logo_url: "",
  store_logo_show_wordmark: "true",
  theme_primary_color: "#E31E2F",
  whatsapp_number: process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210",
  support_email: "thefitnessstore2022@gmail.com",
  contact_phone: "+91 98765 43210",
  store_address: "Shop 12, Prime Fitness Hub, Commercial Plaza, India",
  hero_eyebrow: "BUILT FOR EVERY REP · RETAIL & WHOLESALE",
  hero_headline: "YOUR TRAINING. YOUR EQUIPMENT. YOUR LIMITS.",
  hero_description:
    "From everyday gym essentials to performance-driven equipment, find everything you need to train harder. We equip passionate athletes, home gyms, and commercial fitness centers.",
  wholesale_banner_headline: "BUY FOR YOUR GYM. EQUIP YOUR BUSINESS.",
  currency_symbol: "₹",
  instagram_url: "https://instagram.com",
  facebook_url: "https://facebook.com",
  theme_text_color: "#FFFFFF",
  theme_muted_text_color: "#A6A6A6",
  theme_heading_font: "bebas",
  theme_heading_style: "uppercase",
  hero_featured_badge: "FEATURED CATEGORY",
  hero_featured_title: "IPF-SPEC LEVER BELTS",
  hero_featured_subtitle: "13MM & 11MM HEAVY-DUTY GENUINE LEATHER · STEEL LEVER MECHANISM",
  hero_featured_metric1_val: "13mm",
  hero_featured_metric1_lbl: "IPF Spec",
  hero_featured_metric2_val: "Steel",
  hero_featured_metric2_lbl: "Lever Cast",
  hero_featured_metric3_val: "₹4,200",
  hero_featured_metric3_lbl: "From",
  hero_featured_btn_text: "VIEW LEVER BELTS",
  hero_featured_btn_url: "/shop/gym-belts",
  marquee_line1_text: "THE FITNESS STORE",
  marquee_line2_text: "THE FITNESS STORE · BUILT FOR EVERY REP · PERFORMANCE EQUIPMENT",
  marquee_text_color: "",
};

/**
 * Retrieves all store settings from the database and merges with defaults.
 */
export async function getStoreSettings(): Promise<StoreSettingsMap> {
  try {
    const records = await prisma.storeSetting.findMany();
    const settings = { ...DEFAULT_STORE_SETTINGS };

    for (const record of records) {
      if (record.key in settings && record.value !== null && record.value !== undefined) {
        // @ts-expect-error dynamic key assignment
        settings[record.key] = record.value;
      }
    }

    return settings;
  } catch (error) {
    console.error("Failed to fetch store settings from database, using defaults:", error);
    return DEFAULT_STORE_SETTINGS;
  }
}
