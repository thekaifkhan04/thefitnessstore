import { test, after } from "node:test";
import assert from "node:assert";
import { prisma } from "../lib/prisma";

test("Database contains seeded categories and products", async () => {
  const categoryCount = await prisma.category.count();
  assert.ok(categoryCount >= 10, `Expected at least 10 categories, found ${categoryCount}`);

  const productCount = await prisma.product.count();
  assert.ok(productCount >= 20, `Expected at least 20 products, found ${productCount}`);

  // Check lever belt product specifically
  const leverBelt = await prisma.product.findUnique({
    where: { slug: "repex-lever-belt-imported-13mm" },
    include: { variants: true, images: true, category: true },
  });

  assert.ok(leverBelt !== null);
  assert.strictEqual(leverBelt.sku, "TFS-BELT-001");
  assert.strictEqual(leverBelt.sellingPricePaise, 420000);
  assert.ok(leverBelt.variants.length > 0);
  assert.ok(leverBelt.images.length > 0);
});

test("Admin user exists and is properly seeded", async () => {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@thefitnessstore.com" },
  });

  assert.ok(admin !== null);
  assert.strictEqual(admin.role, "ADMIN");
  assert.ok(admin.passwordHash.length > 20);
});

after(async () => {
  await prisma.$disconnect();
});
