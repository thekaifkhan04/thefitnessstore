import { prisma } from "@/lib/prisma";

export interface StoreSettingsMap {
  store_name: string;
  store_tagline: string;
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
}

export const DEFAULT_STORE_SETTINGS: StoreSettingsMap = {
  store_name: "THE FITNESS STORE",
  store_tagline: "Wholesaler & Retailer of Sports & Fitness Goods",
  whatsapp_number: process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210",
  support_email: "support@thefitnessstore.com",
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
