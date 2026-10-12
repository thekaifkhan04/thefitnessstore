import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../lib/prisma";
import { getStoreSettings } from "../lib/settings";

test("Logo updates persist in database, reflect in getStoreSettings, API, and rendered HTML", async () => {
  const testLogoUrl = "/images/uploads/tfs_upload_1791813474933_kuudon.jpeg";

  // 1. Upsert logo in database
  await prisma.storeSetting.upsert({
    where: { key: "store_logo_url" },
    update: { value: testLogoUrl },
    create: { key: "store_logo_url", value: testLogoUrl },
  });

  await prisma.storeSetting.upsert({
    where: { key: "store_logo_show_wordmark" },
    update: { value: "true" },
    create: { key: "store_logo_show_wordmark", value: "true" },
  });

  // 2. Verify getStoreSettings()
  const settings = await getStoreSettings();
  assert.equal(settings.store_logo_url, testLogoUrl);
  assert.equal(settings.store_logo_show_wordmark, "true");

  // 3. Verify /api/settings
  const apiRes = await fetch("http://localhost:3000/api/settings");
  assert.equal(apiRes.status, 200);
  const apiData = await apiRes.json();
  assert.equal(apiData.settings.store_logo_url, testLogoUrl);

  // 4. Verify homepage HTML contains the img tag
  const homeRes = await fetch("http://localhost:3000/");
  assert.equal(homeRes.status, 200);
  const homeHtml = await homeRes.text();
  assert.ok(homeHtml.includes(testLogoUrl));
  assert.ok(homeHtml.includes('alt="Store Logo"'));
});
