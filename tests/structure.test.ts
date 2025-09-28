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

test("param", (t) => {
  t.assert.snapshot(
    node(
      param("$userId", ($userId) =>
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
