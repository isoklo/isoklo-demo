import { renderInvoice } from "invoice-pdf-renderer-lite";
import { computeInvoice } from "./invoice.js";
import { formatMoney } from "./money.js";

/**
 * Render an invoice as a PDF.
 *
 * @param {object} input Same input as computeInvoice, plus `number`, `customer` and `issuedOn`.
 * @returns {Promise<Uint8Array>} The PDF file.
 */
export async function exportInvoicePdf({ number, customer, issuedOn, ...input }) {
  const invoice = computeInvoice(input);
  return renderInvoice({
    title: `Invoice ${number}`,
    customer,
    issuedOn,
    rows: invoice.lines.map((line) => [line.description, String(line.quantity), formatMoney(line.totalCents)]),
    totals: [
      ["Subtotal", formatMoney(invoice.subtotal)],
      ["Discount", formatMoney(-invoice.discount)],
      ["Tax", formatMoney(invoice.tax)],
      ["Total", formatMoney(invoice.total)],
    ],
  });
}
