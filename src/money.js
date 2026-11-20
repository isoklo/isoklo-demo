/**
 * Money is always an integer number of cents. Floating-point dollars never enter the calculation,
 * so 0.1 + 0.2 problems cannot reach an invoice.
 */

/** "12.34" or 12.34 -> 1234. Rejects more than two decimal places instead of guessing. */
export function toCents(amount) {
  const text = String(amount).trim();
  const match = /^(-)?(\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (match === null) throw new TypeError(`not a money amount: ${JSON.stringify(amount)}`);
  const [, sign, whole, fraction = ""] = match;
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return sign ? -cents : cents;
}

/** Divide and round half up (away from zero for halves), using integers only. */
export function divideRounded(numerator, denominator) {
  const sign = Math.sign(numerator) * Math.sign(denominator);
  const n = Math.abs(numerator);
  const d = Math.abs(denominator);
  return sign * Math.floor((2 * n + d) / (2 * d));
}

/** 1234 -> "$12.34", -500 -> "-$5.00". */
export function formatMoney(cents, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}
