import { divideRounded } from "./money.js";

/**
 * Compute an invoice.
 *
 * @param {object} input
 * @param {{ description: string, quantity: number, unitPriceCents: number }[]} input.items
 * @param {{ type: "percent", value: number } | { type: "fixed", cents: number }} [input.discount]
 * @param {number} [input.taxRateBps] Tax rate in basis points: 825 means 8.25%.
 *
 * Order matters and is fixed: subtotal, then discount, then tax on what is left.
 */
export function computeInvoice({ items, discount, taxRateBps = 0 }) {
  if (!Array.isArray(items) || items.length === 0) throw new TypeError("an invoice needs at least one item");

  const lines = items.map(lineTotal);
  const subtotal = lines.reduce((sum, line) => sum + line.totalCents, 0);
  const discountCents = discountFor(subtotal, discount);
  const taxable = subtotal - discountCents;
  const tax = divideRounded(taxable * taxRateBps, 10_000);

  return { lines, subtotal, discount: discountCents, taxable, tax, total: taxable + tax };
}

export function lineTotal({ description, quantity, unitPriceCents }) {
  if (!Number.isInteger(quantity) || quantity <= 0) throw new RangeError(`quantity must be a positive whole number: ${description}`);
  if (!Number.isInteger(unitPriceCents) || unitPriceCents < 0) throw new RangeError(`unit price must be whole cents: ${description}`);
  return { description, quantity, unitPriceCents, totalCents: quantity * unitPriceCents };
}

function discountFor(subtotal, discount) {
  if (discount === undefined) return 0;
  if (discount.type === "percent") {
    if (!Number.isInteger(discount.value) || discount.value < 0 || discount.value > 100) {
      throw new RangeError(`a percentage discount must be a whole number from 0 to 100: ${discount.value}`);
    }
    return divideRounded(subtotal * discount.value, 100);
  }
  if (discount.type === "fixed") {
    if (!Number.isInteger(discount.cents) || discount.cents < 0) {
      throw new RangeError(`a fixed discount must be zero or more whole cents: ${discount.cents}`);
    }
    return Math.min(discount.cents, subtotal);
  }
  throw new TypeError(`unknown discount type: ${discount.type}`);
}
