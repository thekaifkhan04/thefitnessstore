import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../lib/prisma";
import { getStoreSettings } from "../lib/settings";
import { signAdminToken } from "../lib/auth";

test("REQUIREMENT 6 & 1: ImageAsset model stores and serves binary data in Neon PostgreSQL", async () => {
  // 1. Create a sample 1x1 transparent PNG binary buffer
  const samplePngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  // Create image asset in Neon via Prisma
  const asset = await prisma.imageAsset.create({
    data: {
      data: samplePngBuffer,
      mimeType: "image/png",
      size: samplePngBuffer.length,
      filename: "test_logo.png",
    },
  });

  assert.ok(asset.id, "Asset must have generated CUID id");
  assert.equal(asset.mimeType, "image/png");
  assert.equal(asset.size, samplePngBuffer.length);

  // Retrieve asset by ID
  const retrieved = await prisma.imageAsset.findUnique({
    where: { id: asset.id },
  });

  assert.ok(retrieved, "Asset must be retrievable from Neon database");
  assert.equal(Buffer.compare(Buffer.from(retrieved.data), samplePngBuffer), 0);

  // Clean up test asset
  await prisma.imageAsset.delete({ where: { id: asset.id } });
});

test("REQUIREMENT 5: Marquee text color setting persists and merges with defaults", async () => {
  const originalSettings = await getStoreSettings();
  const testColor = "#FF3366";

  // Upsert marquee_text_color
  await prisma.storeSetting.upsert({
    where: { key: "marquee_text_color" },
    update: { value: testColor },
    create: { key: "marquee_text_color", value: testColor },
  });

  const updated = await getStoreSettings();
  assert.equal(updated.marquee_text_color, testColor, "marquee_text_color must match saved color");

  // Revert back to original
  await prisma.storeSetting.upsert({
    where: { key: "marquee_text_color" },
    update: { value: originalSettings.marquee_text_color || "" },
    create: { key: "marquee_text_color", value: originalSettings.marquee_text_color || "" },
  });

  const restored = await getStoreSettings();
  assert.equal(restored.marquee_text_color, originalSettings.marquee_text_color || "");
});

test("REQUIREMENT 3: Category image persistence in Neon", async () => {
  const categories = await prisma.category.findMany({ take: 1 });
  assert.ok(categories.length > 0, "Must have at least one category");
  const testCat = categories[0];

  const testImageUrl = "/api/images/cuid_sample_category_test";

  // Update category image
  await prisma.category.update({
    where: { id: testCat.id },
    data: { image: testImageUrl },
  });

  const refetched = await prisma.category.findUnique({
    where: { id: testCat.id },
  });

  assert.equal(refetched?.image, testImageUrl, "Category image must persist in Neon");

  // Restore original
  await prisma.category.update({
    where: { id: testCat.id },
    data: { image: testCat.image },
  });
});

test("REQUIREMENT 6 & 1: Live HTTP Image Upload and Image Serving endpoint", async () => {
  const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

  // Check if server is running
  const isServerRunning = await fetch(`${BASE_URL}/api/settings`)
    .then((r) => r.ok)
    .catch(() => false);

  if (!isServerRunning) {
    console.log("Server not running on localhost:3000, skipping live HTTP upload test");
    return;
  }

  // Generate valid admin auth cookie
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  assert.ok(admin, "Seeded admin user must exist");
  const token = await signAdminToken({
    userId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });

  const samplePngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  // 1. Unauthenticated request to /api/admin/upload should be rejected with 401
  const unauthFormData = new FormData();
  unauthFormData.append("file", new Blob([samplePngBuffer], { type: "image/png" }), "test.png");
  const unauthRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    body: unauthFormData,
  });
  assert.equal(unauthRes.status, 401, "Unauthenticated upload must return 401 Unauthorized");

  // 2. Authenticated upload of valid PNG file
  const formData = new FormData();
  formData.append("file", new Blob([samplePngBuffer], { type: "image/png" }), "test_logo.png");
  const uploadRes = await fetch(`${BASE_URL}/api/admin/upload`, {
    method: "POST",
    headers: {
      Cookie: `tfs_admin_token=${token}`,
    },
    body: formData,
  });

  assert.equal(uploadRes.status, 200, "Authenticated upload must return 200 OK");
  const uploadData = await uploadRes.json();
  assert.ok(uploadData.success, "Upload response must have success: true");
  assert.ok(uploadData.url.startsWith("/api/images/"), "Upload response must return /api/images/[id] URL");
  assert.ok(uploadData.id, "Upload response must return asset ID");

  // 3. Fetch image through public /api/images/[id]
  const imageRes = await fetch(`${BASE_URL}${uploadData.url}`);
  assert.equal(imageRes.status, 200, "Public image endpoint must return 200 OK");
  assert.equal(imageRes.headers.get("content-type"), "image/png", "Content-Type must be image/png");
  assert.ok(imageRes.headers.get("cache-control")?.includes("immutable"), "Cache-Control must include immutable");
  const etag = imageRes.headers.get("etag");
  assert.ok(etag, "ETag header must be returned");

  // 4. Conditional GET with If-None-Match should return 304 Not Modified
  const notModifiedRes = await fetch(`${BASE_URL}${uploadData.url}`, {
    headers: { "If-None-Match": etag },
  });
  assert.equal(notModifiedRes.status, 304, "Conditional GET with matching ETag must return 304 Not Modified");

  // 5. Clean up created asset
  await prisma.imageAsset.delete({ where: { id: uploadData.id } });
});
