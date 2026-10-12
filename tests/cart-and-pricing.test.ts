import { test } from "node:test";
import assert from "node:assert";
import { formatINR, calculateDiscount } from "../lib/utils";

test("calculateDiscount returns correct percentage or null", () => {
  // MRP 1000, Selling 800 => 20%
  assert.strictEqual(calculateDiscount(80000, 100000), 20);

  // MRP 5499, Selling 4200 => 24%
  assert.strictEqual(calculateDiscount(420000, 549900), 24);

  // Original price null or smaller than selling price
  assert.strictEqual(calculateDiscount(80000, null), null);
  assert.strictEqual(calculateDiscount(80000, 70000), null);
  assert.strictEqual(calculateDiscount(80000, 80000), null);
});

test("Exact integer paise arithmetic prevents floating point rounding drift", () => {
  const item1Paise = 34900; // ₹349
  const item2Paise = 74900; // ₹749
  const item3Paise = 85000; // ₹850

  const totalPaise = item1Paise + item2Paise + item3Paise;
  assert.strictEqual(totalPaise, 194800); // exactly ₹1,948.00
  assert.strictEqual(formatINR(totalPaise), "₹1,948");
});
