import { divideRounded } from "./money.js";

/**
 * Compute an invoice.
 *
 * @param {object} input
 * @param {{ description: string, quantity: number, unitPriceCents: number }[]} input.items
 * @param {{ type: "percent", value: number } | { type: "fixed", cents: number }} [input.discount]
 * @param {({ type: "percent", value: number } | { type: "fixed", cents: number })[]} [input.discounts] Several discount
 *   codes, applied together. `discount` still works for a single code.
 * @param {number} [input.taxRateBps] Tax rate in basis points: 825 means 8.25%.
 */
export function computeInvoice({ items, discount, discounts = discount ? [discount] : [], taxRateBps = 0 }) {
  if (!Array.isArray(items) || items.length === 0) throw new TypeError("an invoice needs at least one item");

  const lines = items.map(lineTotal);
  const subtotal = lines.reduce((sum, line) => sum + line.totalCents, 0);
  const tax = divideRounded(subtotal * taxRateBps, 10_000);
  const discountCents = discounts.reduce((sum, code) => sum + discountFor(subtotal, code), 0);
  const taxable = subtotal - discountCents;

  return { lines, subtotal, discount: discountCents, taxable, tax, total: taxable + tax };
}

export function lineTotal({ description, quantity, unitPriceCents }) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new RangeError(`quantity must be a positive whole number: ${description}`);
  if (!Number.isInteger(unitPriceCents) || unitPriceCents < 0) throw new RangeError(`unit price must be whole cents: ${description}`);
  return { description, quantity, unitPriceCents, totalCents: quantity * unitPriceCents };
}

function discountFor(subtotal, discount) {
  if (discount === undefined) return 0;
  if (discount.type === "percent") return divideRounded(subtotal * discount.value, 100);
  if (discount.type === "fixed") return discount.cents;
  throw new TypeError(`unknown discount type: ${discount.type}`);
}
