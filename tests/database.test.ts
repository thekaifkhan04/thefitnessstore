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

test("Newly created category and product are immediately retrievable for menu and catalog", async () => {
  const testSlug = `test-cat-${Date.now()}`;
  const category = await prisma.category.create({
    data: {
      name: "Test Dynamic Equipment",
      slug: testSlug,
      description: "Dynamic category created via admin",
      isActive: true,
      displayOrder: 999,
    },
  });

  assert.ok(category.id);
  assert.strictEqual(category.slug, testSlug);

  // Check it appears in active category listings
  const activeCategories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });
  const foundInActive = activeCategories.some((c) => c.id === category.id);
  assert.strictEqual(foundInActive, true);

  // Add a product under this category
  const productSlug = `test-prod-${Date.now()}`;
  const product = await prisma.product.create({
    data: {
      name: "Test Dynamic Kettlebell",
      slug: productSlug,
      sku: `TFS-TEST-${Date.now().toString().slice(-4)}`,
      categoryId: category.id,
      sellingPricePaise: 250000,
      isAvailable: true,
      isFeatured: true,
    },
  });

  assert.ok(product.id);
  assert.strictEqual(product.categoryId, category.id);

  // Clean up test data
  await prisma.product.delete({ where: { id: product.id } });
  await prisma.category.delete({ where: { id: category.id } });
});

after(async () => {
  await prisma.$disconnect();
});
