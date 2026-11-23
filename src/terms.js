/** Payment terms, and the number of days each one gives the customer. */
export const TERMS = {
  "due-on-receipt": 0,
  "net-15": 15,
  "net-30": 30,
  "net-60": 60,
};

/**
 * The date an invoice is due, as YYYY-MM-DD.
 * Dates are calendar dates, computed in UTC, so the result never shifts with the server's time zone.
 */
export function dueDate(issuedOn, terms) {
  if (!Object.hasOwn(TERMS, terms)) throw new RangeError(`unknown payment terms: ${terms}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(issuedOn)) throw new TypeError(`issuedOn must be YYYY-MM-DD: ${issuedOn}`);
  const date = new Date(`${issuedOn}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== issuedOn) {
    throw new RangeError(`not a real date: ${issuedOn}`);
  }
  date.setUTCDate(date.getUTCDate() + TERMS[terms]);
  return date.toISOString().slice(0, 10);
}
