import { test } from "node:test";
import { rules } from "./database.rules.ts";

test("json rules are up-to-date", (t) => {
  t.assert.snapshot(rules());
});
