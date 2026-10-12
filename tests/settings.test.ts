import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../lib/prisma";
import { getStoreSettings, DEFAULT_STORE_SETTINGS } from "../lib/settings";
import { buildWhatsAppUrl } from "../lib/whatsapp";

test("getStoreSettings returns default settings when no overrides exist", async () => {
  const settings = await getStoreSettings();
  assert.ok(settings.store_name);
  assert.ok(settings.whatsapp_number);
  assert.ok(settings.hero_headline);
});

test("Updating StoreSetting in database immediately affects getStoreSettings", async () => {
  const testPhone = "919999888877";
  const original = await prisma.storeSetting.findUnique({
    where: { key: "whatsapp_number" },
  });

  try {
    // Update setting
    await prisma.storeSetting.upsert({
      where: { key: "whatsapp_number" },
      update: { value: testPhone },
      create: { key: "whatsapp_number", value: testPhone },
    });

    const updatedSettings = await getStoreSettings();
    assert.equal(updatedSettings.whatsapp_number, testPhone);

    const generatedUrl = buildWhatsAppUrl("Test message", updatedSettings.whatsapp_number);
    assert.ok(generatedUrl.includes(`wa.me/${testPhone}`));
  } finally {
    // Restore original setting
    if (original?.value) {
      await prisma.storeSetting.update({
        where: { key: "whatsapp_number" },
        data: { value: original.value },
      });
    } else {
      await prisma.storeSetting.deleteMany({
        where: { key: "whatsapp_number" },
      });
    }
  }
});

test("Custom store name dynamically reflects in messages and URLs", async () => {
  const customStoreName = "TFS ELITE ATHLETICS";
  const testPhone = "918888777766";
  const message = `Hello ${customStoreName}! Enquiring about gym gear.`;
  const url = buildWhatsAppUrl(message, testPhone);

  assert.ok(url.startsWith(`https://wa.me/${testPhone}?text=`));
  assert.ok(url.includes("TFS%20ELITE%20ATHLETICS"));
});
