import { test } from "node:test";
import { data, equal } from "../src/index.ts";

test("data.isString", (t) => {
  t.assert.snapshot(data.isString((v) => equal(v, "hello"))());
});
