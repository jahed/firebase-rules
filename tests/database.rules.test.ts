import { rules } from "./database.rules.ts";
import { test } from "node:test";

test("json rules are up-to-date", (t) => {
  t.assert.snapshot(rules());
});
