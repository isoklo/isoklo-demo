import { test } from "node:test";
import assert from "node:assert/strict";
import { computeInvoice } from "../src/invoice.js";

test("subtotal is the sum of quantity × unit price", () => {
  const invoice = computeInvoice({
    items: [
      { description: "Logo design", quantity: 3, unitPriceCents: 12000 },
      { description: "Hosting (monthly)", quantity: 1, unitPriceCents: 2499 },
    ],
  });
  assert.equal(invoice.subtotal, 38499);
  assert.equal(invoice.total, 38499);
});

test("a percentage discount is taken before tax", () => {
  const invoice = computeInvoice({
    items: [{ description: "Consulting (hours)", quantity: 10, unitPriceCents: 15000 }],
    discount: { type: "percent", value: 10 },
    taxRateBps: 825,
  });
  assert.equal(invoice.subtotal, 150000);
  assert.equal(invoice.discount, 15000);
  assert.equal(invoice.taxable, 135000);
  assert.equal(invoice.tax, 11138); // 8.25% of $1,350.00 = $111.375, rounded half up
  assert.equal(invoice.total, 146138);
});

test("a fixed discount never takes the total below zero", () => {
  const invoice = computeInvoice({
    items: [{ description: "Sticker pack", quantity: 1, unitPriceCents: 300 }],
    discount: { type: "fixed", cents: 500 },
    taxRateBps: 825,
  });
  assert.equal(invoice.discount, 300);
  assert.equal(invoice.total, 0);
});

test("tax rounds half a cent up", () => {
  const invoice = computeInvoice({
    items: [{ description: "Domain renewal", quantity: 1, unitPriceCents: 1020 }],
    taxRateBps: 1250,
  });
  assert.equal(invoice.tax, 128); // 12.5% of $10.20 = $1.275
  assert.equal(invoice.total, 1148);
});

test("bad input is rejected, not guessed at", () => {
  assert.throws(() => computeInvoice({ items: [] }), TypeError);
  assert.throws(
    () => computeInvoice({ items: [{ description: "Half a chair", quantity: 0.5, unitPriceCents: 9900 }] }),
    RangeError,
  );
  assert.throws(
    () => computeInvoice({ items: [{ description: "Desk", quantity: 1, unitPriceCents: 99.99 }] }),
    RangeError,
  );
});
