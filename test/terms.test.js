import { test } from "node:test";
import assert from "node:assert/strict";
import { dueDate } from "../src/terms.js";

test("net-30 is due thirty days after the issue date", () => {
  assert.equal(dueDate("2026-01-15", "net-30"), "2026-02-14");
});

test("due dates roll over month ends and leap days", () => {
  assert.equal(dueDate("2026-01-31", "net-30"), "2026-03-02");
  assert.equal(dueDate("2028-02-15", "net-15"), "2028-03-01");
});

test("due on receipt is due the day it is issued", () => {
  assert.equal(dueDate("2026-06-30", "due-on-receipt"), "2026-06-30");
});

test("unknown terms and impossible dates are rejected", () => {
  assert.throws(() => dueDate("2026-01-15", "net-45"), RangeError);
  assert.throws(() => dueDate("2026-02-30", "net-30"), RangeError);
  assert.throws(() => dueDate("15/01/2026", "net-30"), TypeError);
});
