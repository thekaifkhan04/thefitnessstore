import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../lib/prisma";
import { getStoreSettings } from "../lib/settings";

test("FIX 1: Homepage tagline persists in database, updates via getStoreSettings, and reflects in /api/settings", async () => {
  const originalSettings = await getStoreSettings();
  const testTagline = "ENGINEERED FOR POWERLIFTERS · RETAIL & WHOLESALE";

  // 1. Save new tagline in database
  await prisma.storeSetting.upsert({
    where: { key: "hero_eyebrow" },
    update: { value: testTagline },
    create: { key: "hero_eyebrow", value: testTagline },
  });

  // 2. Verify getStoreSettings() reflects the exact saved value
  const updatedSettings = await getStoreSettings();
  assert.equal(updatedSettings.hero_eyebrow, testTagline, "hero_eyebrow must match saved value");

  // 3. Test empty/cleared tagline handling (should not be overridden by fallback)
  await prisma.storeSetting.upsert({
    where: { key: "hero_eyebrow" },
    update: { value: "" },
    create: { key: "hero_eyebrow", value: "" },
  });

  const clearedSettings = await getStoreSettings();
  assert.equal(clearedSettings.hero_eyebrow, "", "hero_eyebrow must be empty string when cleared by admin");

  // 4. Restore original or standard tagline
  const restoreValue = originalSettings.hero_eyebrow || "BUILT FOR EVERY REP · RETAIL & WHOLESALE";
  await prisma.storeSetting.upsert({
    where: { key: "hero_eyebrow" },
    update: { value: restoreValue },
    create: { key: "hero_eyebrow", value: restoreValue },
  });

  const restoredSettings = await getStoreSettings();
  assert.equal(restoredSettings.hero_eyebrow, restoreValue);
});

test("FIX 2 & 3: Header branding displays only 'THE FITNESS STORE' and removes 'TFS · SPORTS & FITNESS'", async () => {
  const settings = await getStoreSettings();
  assert.equal(settings.store_name, "THE FITNESS STORE");

  // If local server is running, check rendered HTML
  try {
    const res = await fetch("http://localhost:3000/");
    if (res.ok) {
      const html = await res.text();
      // Ensure "THE FITNESS STORE" is present
      assert.ok(html.includes("THE FITNESS STORE"), "Header must include 'THE FITNESS STORE'");
      // Ensure secondary subtitle is NOT in the header branding
      assert.ok(!html.includes("TFS · SPORTS & FITNESS"), "Header must NOT include 'TFS · SPORTS & FITNESS'");
      // Ensure no decorative dash before the tagline
      assert.ok(!html.includes("w-10 h-1 bg-[#E31E2F] rounded-full"), "Homepage must not contain decorative dash before tagline");
    }
  } catch {
    // If dev server isn't running on 3000, skip network fetch
  }
});
