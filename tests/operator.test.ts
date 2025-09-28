import { test } from "node:test";
import { auth, data, equal, newData, notEqual } from "../src/index.ts";

test("auth === null", (t) => {
  t.assert.snapshot(equal(auth, null)());
});

test("data === null", (t) => {
  t.assert.snapshot(equal(data, null)());
});

test("newData === null", (t) => {
  t.assert.snapshot(equal(newData, null)());
});

test("auth !== null", (t) => {
  t.assert.snapshot(notEqual(auth, null)());
});
