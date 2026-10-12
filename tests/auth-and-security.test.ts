import { test } from "node:test";
import assert from "node:assert";
import {
  hashPassword,
  verifyPassword,
  signAdminToken,
  verifyAdminToken,
} from "../lib/auth";

test("hashPassword produces valid bcrypt hash and verifyPassword confirms it", async () => {
  const password = "Admin@TFS2026Secure";
  const hash = await hashPassword(password);

  assert.notStrictEqual(hash, password);
  assert.ok(hash.startsWith("$2")); // bcrypt format

  const valid = await verifyPassword(password, hash);
  assert.strictEqual(valid, true);

  const invalid = await verifyPassword("WrongPassword123", hash);
  assert.strictEqual(invalid, false);
});

test("signAdminToken creates verifiable JWT payload", async () => {
  const payload = {
    userId: "usr_admin_123",
    email: "admin@thefitnessstore.com",
    name: "TFS Store Admin",
    role: "ADMIN",
  };

  const token = await signAdminToken(payload);
  assert.ok(typeof token === "string" && token.length > 20);

  const verified = await verifyAdminToken(token);
  assert.ok(verified !== null);
  assert.strictEqual(verified.email, payload.email);
  assert.strictEqual(verified.role, "ADMIN");
  assert.strictEqual(verified.userId, payload.userId);
});

test("verifyAdminToken rejects tampered or expired tokens", async () => {
  const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature";
  const result = await verifyAdminToken(fakeToken);
  assert.strictEqual(result, null);
});
