import { test, describe, before, after } from "node:test";
import assert from "node:assert";
import { prisma } from "../lib/prisma";
import { signAdminToken } from "../lib/auth";
import { formatINR } from "../lib/utils";
import { generateCartOrderMessage, buildWhatsAppUrl } from "../lib/whatsapp";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let adminCookie = "";
let adminToken = "";

before(async () => {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@thefitnessstore.com" },
  });
  assert.ok(admin, "Admin user must exist in DB");
  adminToken = await signAdminToken({
    userId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  });
  adminCookie = `tfs_admin_token=${adminToken}`;
});

describe("1. Customer Flow - Public Pages & Catalog Health", () => {
  test("All public pages return 200 OK and valid HTML", async () => {
    const publicPages = [
      "/",
      "/shop",
      "/offers",
      "/about",
      "/contact",
      "/bulk-orders",
      "/privacy-policy",
      "/terms",
      "/shipping-policy",
      "/returns-policy",
      "/search?q=belt",
      "/search?q=dumbbell",
      "/search?q=xyznonexistentitem123",
    ];

    for (const page of publicPages) {
      const res = await fetch(`${BASE_URL}${page}`);
      assert.strictEqual(res.status, 200, `Page ${page} must return 200 OK`);
      const html = await res.text();
      assert.ok(html.length > 500, `Page ${page} must return non-empty HTML content`);
      assert.ok(html.includes("<!DOCTYPE html>"), `Page ${page} must return valid HTML doc`);
    }
  });

  test("All seeded category pages return 200 OK with product cards", async () => {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, name: true },
    });
    assert.ok(categories.length > 0, "Must have active categories");

    for (const cat of categories) {
      const res = await fetch(`${BASE_URL}/shop/${cat.slug}`);
      assert.strictEqual(res.status, 200, `Category page /shop/${cat.slug} must return 200 OK`);
      const html = await res.text();
      const hasName = html.includes(cat.name) || html.includes(cat.name.replace(/&/g, "&amp;"));
      assert.ok(hasName, `Page /shop/${cat.slug} must contain category name "${cat.name}"`);
    }
  });

  test("Product detail pages render correct price, SKU, and availability", async () => {
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      take: 5,
      include: { variants: true },
    });
    assert.ok(products.length > 0, "Must have available products");

    for (const prod of products) {
      const res = await fetch(`${BASE_URL}/product/${prod.slug}`);
      assert.strictEqual(res.status, 200, `Product page /product/${prod.slug} must return 200 OK`);
      const html = await res.text();
      assert.ok(html.includes(prod.name), `Product page must render product name "${prod.name}"`);
      assert.ok(html.includes(prod.sku), `Product page must render SKU "${prod.sku}"`);
      
      const formattedPrice = formatINR(prod.sellingPricePaise);
      assert.ok(html.includes(formattedPrice), `Product page must render price ${formattedPrice}`);
    }
  });

  test("Privacy policy and contact pages contain updated official email and phone", async () => {
    const privacyRes = await fetch(`${BASE_URL}/privacy-policy`);
    const privacyHtml = await privacyRes.text();
    assert.ok(
      privacyHtml.includes("thefitnessstore2022@gmail.com"),
      "Privacy policy must contain official email thefitnessstore2022@gmail.com"
    );

    const contactRes = await fetch(`${BASE_URL}/contact`);
    const contactHtml = await contactRes.text();
    assert.ok(
      contactHtml.includes("thefitnessstore2022@gmail.com"),
      "Contact page must contain official email thefitnessstore2022@gmail.com"
    );
    assert.ok(
      contactHtml.includes("9263943784"),
      "Contact page must contain contact phone number"
    );
  });
});

describe("2. Customer Flow - Cart, WhatsApp Ordering & Enquiries", () => {
  test("WhatsApp cart order message generates correctly with paise precision", () => {
    const items = [
      {
        id: "prod-1",
        name: "Repex Lever Belt 13mm",
        sku: "TFS-BLT-13",
        variantName: "Size L (34-38 inch)",
        quantity: 1,
        unitPricePaise: 500000,
      },
      {
        id: "prod-2",
        name: "Bouncer Dumbbell Pair 20kg",
        sku: "TFS-DB-20",
        variantName: "20kg Pair",
        quantity: 2,
        unitPricePaise: 640000,
      },
    ];

    const message = generateCartOrderMessage(items, {
      reference: "TFS-TEST-ORDER-1",
      customerName: "Rahul Verma",
      customerNote: "Please deliver to Flat 402, Ranchi, Jharkhand",
    });

    assert.ok(message.includes("Rahul Verma"), "Message must include customer name");
    assert.ok(message.includes("TFS-TEST-ORDER-1"), "Message must include order reference");
    assert.ok(message.includes("Repex Lever Belt 13mm"), "Message must include item 1");
    assert.ok(message.includes("Bouncer Dumbbell Pair 20kg"), "Message must include item 2");
    
    // Total calculation: 500000 + (640000 * 2) = 1780000 paise = ₹17,800
    const totalPaise = 500000 + (640000 * 2);
    assert.ok(message.includes(formatINR(totalPaise)), "Message must include correct grand total");

    const waUrl = buildWhatsAppUrl(message, "919263943784");
    assert.ok(waUrl.startsWith("https://wa.me/919263943784?text="), "Must produce valid wa.me URL");
    assert.ok(!waUrl.includes(" "), "URL must not contain unencoded raw spaces");
  });

  test("Customer can submit an order enquiry via API with full item detail", async () => {
    const existingProduct = await prisma.product.findFirst({
      where: { isAvailable: true },
      select: { id: true, name: true, sku: true, sellingPricePaise: true },
    });
    assert.ok(existingProduct, "Product must exist for enquiry test");

    const payload = {
      customerName: "Priya Singh",
      customerPhone: "+91 9876543210",
      customerNote: "Please confirm dispatch time",
      items: [
        {
          productId: existingProduct.id,
          productName: existingProduct.name,
          productSku: existingProduct.sku,
          variantName: "Standard",
          quantity: 1,
          unitPricePaise: existingProduct.sellingPricePaise,
        },
      ],
    };

    const res = await fetch(`${BASE_URL}/api/enquiries/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 200, "Enquiry creation must return 200 OK");
    const data = await res.json();
    assert.strictEqual(data.success, true, "Enquiry API must respond success: true");
    assert.ok(data.id, "Must return created enquiry ID");

    // Verify in database
    const saved = await prisma.orderEnquiry.findUnique({
      where: { id: data.id },
      include: { items: true },
    });
    assert.ok(saved, "Enquiry must be found in DB");
    assert.strictEqual(saved.customerName, "Priya Singh");
    assert.strictEqual(saved.items.length, 1);
    assert.strictEqual(saved.items[0].productName, existingProduct.name);

    // Cleanup
    await prisma.orderEnquiryItem.deleteMany({ where: { enquiryId: data.id } });
    await prisma.orderEnquiry.delete({ where: { id: data.id } });
  });

  test("Enquiry API rejects invalid or empty requests gracefully", async () => {
    const res = await fetch(`${BASE_URL}/api/enquiries/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    // Should return 400 Bad Request
    assert.strictEqual(res.status, 400, "Empty payload must be rejected with 400 Bad Request");
  });
});

describe("3. Admin Flow - Security, Authentication & Protected APIs", () => {
  test("Admin login succeeds with valid credentials and sets cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@thefitnessstore.com",
        password: "Admin@TFS2026Secure",
      }),
    });

    assert.strictEqual(res.status, 200, "Valid admin login must return 200 OK");
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, "admin@thefitnessstore.com");
    assert.strictEqual(data.user.role, "ADMIN");

    const setCookie = res.headers.get("set-cookie");
    assert.ok(setCookie && setCookie.includes("tfs_admin_token"), "Must set tfs_admin_token cookie");
  });

  test("Admin login rejects invalid password with 401 Unauthorized", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@thefitnessstore.com",
        password: "WrongPassword123!",
      }),
    });

    assert.strictEqual(res.status, 401, "Invalid password must return 401 Unauthorized");
  });

  test("Unauthenticated requests to admin APIs are rejected with 401", async () => {
    const protectedEndpoints = [
      { url: `${BASE_URL}/api/admin/products`, method: "GET" },
      { url: `${BASE_URL}/api/admin/categories`, method: "GET" },
      { url: `${BASE_URL}/api/admin/offers`, method: "GET" },
      { url: `${BASE_URL}/api/admin/settings`, method: "GET" },
      { url: `${BASE_URL}/api/admin/products`, method: "POST" },
      { url: `${BASE_URL}/api/admin/categories`, method: "POST" },
      { url: `${BASE_URL}/api/admin/settings`, method: "POST" },
    ];

    for (const ep of protectedEndpoints) {
      const res = await fetch(ep.url, {
        method: ep.method,
        headers: { "Content-Type": "application/json" },
        body: ep.method === "POST" ? JSON.stringify({}) : undefined,
      });
      assert.strictEqual(
        res.status,
        401,
        `Unauthenticated ${ep.method} ${ep.url} must return 401 Unauthorized`
      );
    }
  });
});

describe("4. Admin Flow - Category Management Lifecycle", () => {
  let createdCatId = "";
  const testSlug = `e2e-test-category-${Date.now()}`;

  test("Admin can create a new category", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: "Test Lifting Straps",
        slug: testSlug,
        description: "Heavy duty cotton and leather wrist lifting straps",
        displayOrder: 999,
        isActive: true,
      }),
    });

    assert.ok(res.status === 200 || res.status === 201, "Creating category must succeed");
    const data = await res.json();
    assert.ok(data.category?.id, "Response must include created category");
    createdCatId = data.category.id;
  });

  test("Admin can fetch category list including the newly created category", async () => {
    assert.ok(createdCatId, "Category ID must be present");
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.categories));
    const found = data.categories.find((c: any) => c.id === createdCatId);
    assert.ok(found, "Newly created category must appear in list");
  });

  test("Admin can update the category details", async () => {
    assert.ok(createdCatId, "Category ID must be present");
    const res = await fetch(`${BASE_URL}/api/admin/categories/${createdCatId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: "Test Lifting Straps (Updated)",
        slug: testSlug,
        description: "Updated description for test category",
        displayOrder: 1000,
        isActive: true,
      }),
    });

    assert.strictEqual(res.status, 200, "Updating category must return 200 OK");
    const data = await res.json();
    assert.strictEqual(data.category.name, "Test Lifting Straps (Updated)");
  });

  test("Admin can delete the test category", async () => {
    assert.ok(createdCatId, "Category ID must be present");
    const res = await fetch(`${BASE_URL}/api/admin/categories/${createdCatId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });

    assert.strictEqual(res.status, 200, "Deleting category must return 200 OK");

    const check = await prisma.category.findUnique({ where: { id: createdCatId } });
    assert.strictEqual(check, null, "Category must be removed from DB");
  });
});

describe("5. Admin Flow - Product Management Lifecycle", () => {
  let tempCatId = "";
  let createdProductId = "";
  const time = Date.now();
  const testProductSlug = `e2e-test-wrist-wraps-${time}`;

  before(async () => {
    const cat = await prisma.category.create({
      data: {
        name: `Temp Cat ${time}`,
        slug: `temp-cat-${time}`,
        isActive: true,
      },
    });
    tempCatId = cat.id;
  });

  test("Admin can create a product with variants and pricing", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: "Heavy Duty Wrist Wraps 24 Inch",
        slug: testProductSlug,
        sku: `TFS-WW-${time.toString().slice(-4)}`,
        categoryId: tempCatId,
        sellingPricePaise: 89900, // ₹899
        originalPricePaise: 129900, // ₹1,299
        stock: 50,
        isAvailable: true,
        isFeatured: true,
        description: "Elasticized thumb loop support wraps for heavy bench pressing.",
        variants: [
          { name: "24 Inch - Red Line", size: "24 Inch", color: "Red/Black", stock: 30, pricePaise: 89900 },
          { name: "36 Inch - Stealth Black", size: "36 Inch", color: "Black", stock: 20, pricePaise: 99900 },
        ],
      }),
    });

    assert.ok(res.status === 200 || res.status === 201, "Creating product must succeed");
    const data = await res.json();
    assert.ok(data.product?.id, "Must return product ID");
    createdProductId = data.product.id;
    assert.strictEqual(data.product.variants.length, 2, "Must create 2 variants");
  });

  test("Newly created product is immediately visible on the public store", async () => {
    const res = await fetch(`${BASE_URL}/product/${testProductSlug}`);
    assert.strictEqual(res.status, 200, "Public product page must return 200 OK");
    const html = await res.text();
    assert.ok(html.includes("Heavy Duty Wrist Wraps 24 Inch"), "Public page must show product name");
    assert.ok(html.includes("₹899"), "Public page must show selling price");
  });

  test("Admin can update product pricing and availability", async () => {
    assert.ok(createdProductId, "Product ID must be present");
    const res = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        name: "Heavy Duty Wrist Wraps 24 Inch (Sale)",
        slug: testProductSlug,
        sku: `TFS-WW-${time.toString().slice(-4)}`,
        categoryId: tempCatId,
        sellingPricePaise: 79900, // ₹799
        isAvailable: true,
        isFeatured: true,
      }),
    });

    assert.strictEqual(res.status, 200, "Updating product must return 200 OK");
    const data = await res.json();
    assert.strictEqual(data.product.sellingPricePaise, 79900);
  });

  test("Admin can delete the product", async () => {
    assert.ok(createdProductId, "Product ID must be present");
    const res = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });

    assert.strictEqual(res.status, 200, "Deleting product must return 200 OK");

    const check = await prisma.product.findUnique({ where: { id: createdProductId } });
    assert.strictEqual(check, null, "Product must be deleted from DB");
  });

  after(async () => {
    if (createdProductId) {
      await prisma.productVariant.deleteMany({ where: { productId: createdProductId } }).catch(() => {});
      await prisma.productImage.deleteMany({ where: { productId: createdProductId } }).catch(() => {});
      await prisma.product.deleteMany({ where: { id: createdProductId } }).catch(() => {});
    }
    if (tempCatId) {
      await prisma.category.deleteMany({ where: { id: tempCatId } }).catch(() => {});
    }
  });
});

describe("6. Admin Flow - Promotional Offers Lifecycle", () => {
  let testOfferId = "";

  test("Admin can create a new promotional offer", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        title: "Olympic Barbell Weekend Sale",
        badge: "WEEKEND SALE",
        description: "Special ₹1000 cashback on commercial barbells this weekend.",
        code: "WEEKEND1000",
        discountPercent: 10,
        ctaLabel: "GRAB DEAL",
        ctaUrl: "/shop",
        isActive: true,
      }),
    });

    assert.ok(res.status === 200 || res.status === 201, "Creating offer must succeed");
    const data = await res.json();
    assert.ok(data.offer?.id);
    testOfferId = data.offer.id;
  });

  test("Newly created offer appears on the public Deals & Offers page", async () => {
    const res = await fetch(`${BASE_URL}/offers`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("Olympic Barbell Weekend Sale"), "Public /offers must show new offer title");
    assert.ok(html.includes("WEEKEND1000"), "Public /offers must show promo code");
    assert.ok(html.includes("WEEKEND SALE"), "Public /offers must show badge");
  });

  test("Admin can delete the promotional offer", async () => {
    assert.ok(testOfferId, "Offer ID must be present");
    const res = await fetch(`${BASE_URL}/api/admin/offers/${testOfferId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });

    assert.strictEqual(res.status, 200);
    const check = await prisma.offer.findUnique({ where: { id: testOfferId } });
    assert.strictEqual(check, null, "Offer must be deleted from DB");
  });
});

describe("7. Admin Flow - Settings Management & Persistence", () => {
  test("Admin can retrieve settings via API", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/settings`, {
      headers: { Cookie: adminCookie },
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data.settings), "Admin settings must return array of settings");
  });

  test("Admin can update settings and changes reflect immediately", async () => {
    const originalSettings = await prisma.storeSetting.findMany();
    const originalTagline = originalSettings.find((s) => s.key === "store_tagline")?.value || "";

    const testTagline = `Premier Fitness Goods · E2E Test ${Date.now()}`;

    // Update via API
    const updateRes = await fetch(`${BASE_URL}/api/admin/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        store_tagline: testTagline,
      }),
    });

    assert.strictEqual(updateRes.status, 200);

    // Verify public settings API immediately reflects updated tagline
    const publicRes = await fetch(`${BASE_URL}/api/settings`);
    const publicData = await publicRes.json();
    assert.strictEqual(publicData.settings.store_tagline, testTagline);

    // Restore original tagline
    await fetch(`${BASE_URL}/api/admin/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({
        store_tagline: originalTagline || "Wholesaler & Retailer of Sports & Fitness Goods",
      }),
    });
  });
});

describe("8. Admin Flow - Enquiry Status Tracking", () => {
  let enquiryId = "";

  before(async () => {
    const created = await prisma.orderEnquiry.create({
      data: {
        reference: `ENQ-TRACK-${Date.now()}`,
        customerName: "Sanjay Kumar",
        customerPhone: "9876543210",
        totalAmountPaise: 1200000,
        status: "ENQUIRY_INITIATED",
      },
    });
    enquiryId = created.id;
  });

  test("Admin can update enquiry status to CONTACTED", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: adminCookie,
      },
      body: JSON.stringify({ status: "CONTACTED" }),
    });

    assert.strictEqual(res.status, 200, "Updating enquiry status must return 200 OK");
    const data = await res.json();
    assert.strictEqual(data.enquiry.status, "CONTACTED");
  });

  after(async () => {
    if (enquiryId) {
      await prisma.orderEnquiry.deleteMany({ where: { id: enquiryId } });
    }
  });
});

after(async () => {
  await prisma.$disconnect();
});
