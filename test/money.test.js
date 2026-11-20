import { test } from "node:test";
import assert from "node:assert/strict";
import { divideRounded, formatMoney, toCents } from "../src/money.js";

test("toCents parses dollars into whole cents", () => {
  assert.equal(toCents("12.34"), 1234);
  assert.equal(toCents("7"), 700);
  assert.equal(toCents("0.5"), 50);
  assert.equal(toCents("-3.10"), -310);
});

test("toCents refuses amounts it would have to round", () => {
  assert.throws(() => toCents("1.234"), TypeError);
  assert.throws(() => toCents("twelve"), TypeError);
});

test("divideRounded rounds halves away from zero", () => {
  assert.equal(divideRounded(5, 2), 3);
  assert.equal(divideRounded(-5, 2), -3);
  assert.equal(divideRounded(4, 2), 2);
});

test("formatMoney shows dollars, with the sign in front", () => {
  assert.equal(formatMoney(1234), "$12.34");
  assert.equal(formatMoney(-500), "-$5.00");
});
