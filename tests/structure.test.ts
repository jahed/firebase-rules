import { test } from "node:test";
import {
  auth,
  equal,
  newData,
  node,
  param,
  props,
  validate,
  write,
} from "../src/index.ts";
import { extractParamKey } from "../src/structure.ts";

test("param", (t) => {
  t.assert.snapshot(
    node(
      param(($userId) =>
        node(
          props({
            name: node(validate(newData.isString())),
          }),
          write(equal(auth.uid, $userId)),
        ),
      ),
    ),
  );
});

// prettier-ignore
test("param key", (t) => {
  // @ts-ignore 
  t.assert.strictEqual(extractParamKey($userId123 => true), "$userId123");

  // @ts-ignore
  t.assert.strictEqual(extractParamKey(($userId123) => true), "$userId123");

  // @ts-ignore
  t.assert.strictEqual(extractParamKey((userId123) => true), undefined);

  // @ts-ignore
  t.assert.strictEqual(extractParamKey(function fn($userId123) { return true }), "$userId123");

  // @ts-ignore
  t.assert.strictEqual(extractParamKey(function ($userId123) { return true }), "$userId123");

  // @ts-ignore
  t.assert.strictEqual(extractParamKey(function (userId123) { return true }), undefined);
});
