import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const updateSettingsSchema = z.record(z.string(), z.string());

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.storeSetting.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const json = await req.json();
    const settingsObj = updateSettingsSchema.parse(json);

    for (const [key, value] of Object.entries(settingsObj)) {
      // Whitelist only public safe keys
      if (
        [
          "store_name",
          "store_tagline",
          "store_logo_url",
          "theme_primary_color",
          "whatsapp_number",
          "support_email",
          "contact_phone",
          "store_address",
          "hero_eyebrow",
          "hero_headline",
          "hero_description",
          "wholesale_banner_headline",
          "currency_symbol",
          "instagram_url",
          "facebook_url",
          "theme_text_color",
          "theme_muted_text_color",
          "theme_heading_font",
          "theme_heading_style",
          "hero_featured_badge",
          "hero_featured_title",
          "hero_featured_subtitle",
          "hero_featured_metric1_val",
          "hero_featured_metric1_lbl",
          "hero_featured_metric2_val",
          "hero_featured_metric2_lbl",
          "hero_featured_metric3_val",
          "hero_featured_metric3_lbl",
          "hero_featured_btn_text",
          "hero_featured_btn_url",
          "marquee_line1_text",
          "marquee_line2_text",
        ].includes(key)
      ) {
        await prisma.storeSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
      }
    }

    // Bust server cache across all affected routes and layouts
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/shop");
    revalidatePath("/bulk-orders");
    revalidatePath("/offers");
    revalidatePath("/admin/settings");

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error: any) {
    console.error("Settings update error:", error);
    if (error?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
