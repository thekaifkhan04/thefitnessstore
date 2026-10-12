import { test } from "node:test";
import assert from "node:assert";
import {
  generateSingleProductMessage,
  generateCartOrderMessage,
  generateWholesaleMessage,
  cleanWhatsAppNumber,
  buildWhatsAppUrl,
  formatINR,
} from "../lib/whatsapp";

test("cleanWhatsAppNumber formats Indian 10-digit number to international format", () => {
  const result = cleanWhatsAppNumber("9876543210");
  assert.strictEqual(result, "919876543210");

  const formatted = cleanWhatsAppNumber("+91 98765 43210");
  assert.strictEqual(formatted, "919876543210");
});

test("formatINR formats paise correctly to Indian Rupee symbol", () => {
  assert.strictEqual(formatINR(79900), "₹799");
  assert.strictEqual(formatINR(420000), "₹4,200");
  assert.strictEqual(formatINR(4800000), "₹48,000");
});

test("generateSingleProductMessage contains product name, SKU, variant, price and subtotal", () => {
  const item = {
    id: "prod-1",
    name: "Repex Lever Belt Imported 13mm",
    sku: "TFS-BELT-001",
    variantName: "Size M",
    quantity: 1,
    unitPricePaise: 420000,
  };

  const msg = generateSingleProductMessage(item);

  assert.ok(msg.includes("Hello THE FITNESS STORE!"));
  assert.ok(msg.includes("Product: Repex Lever Belt Imported 13mm"));
  assert.ok(msg.includes("Product Code: TFS-BELT-001"));
  assert.ok(msg.includes("Variant: Size M"));
  assert.ok(msg.includes("Price: ₹4,200"));
  assert.ok(msg.includes("Subtotal: ₹4,200"));
  assert.ok(msg.includes("Please confirm availability and delivery details."));
});

test("generateCartOrderMessage contains numbered list and correct total sum", () => {
  const items = [
    {
      id: "prod-1",
      name: "Repex Lever Belt Imported 13mm",
      sku: "TFS-BELT-001",
      variantName: "Size M",
      quantity: 1,
      unitPricePaise: 420000,
    },
    {
      id: "prod-2",
      name: "Bouncer Dumbbells (Pair)",
      sku: "TFS-DB-001",
      variantName: "5 Kg Pair",
      quantity: 2,
      unitPricePaise: 165000,
    },
  ];

  const msg = generateCartOrderMessage(items, {
    reference: "TFS-TEST-001",
    customerName: "Rahul",
  });

  assert.ok(msg.includes("1. Product: Repex Lever Belt Imported 13mm"));
  assert.ok(msg.includes("2. Product: Bouncer Dumbbells (Pair)"));
  assert.ok(msg.includes("Enquiry Ref: TFS-TEST-001"));
  assert.ok(msg.includes("Customer: Rahul"));
  // Total = 4200 + (1650 * 2) = 7500 => ₹7,500
  assert.ok(msg.includes("Cart Subtotal: ₹7,500"));
  assert.ok(msg.includes("Please confirm availability, delivery charges, and the final order amount."));
});

test("buildWhatsAppUrl generates valid wa.me URL with properly encoded message", () => {
  const rawMsg = "Hello TFS! Price: ₹4,200 & stock?";
  const url = buildWhatsAppUrl(rawMsg, "919876543210");

  assert.ok(url.startsWith("https://wa.me/919876543210?text="));
  assert.ok(!url.includes(" ")); // spaces must be URL-encoded (%20)
  assert.ok(url.includes("%20"));
});
