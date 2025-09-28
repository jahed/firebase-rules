import { createRuleObject } from "./object.ts";
import { allOf } from "./operator.ts";
import { createRuleBoolean, createRuleNumber } from "./primitive.ts";
import { toJSONString } from "./serialise.ts";
import { createRuleString } from "./string.ts";
import type {
  PrimitiveOrExpression,
  RuleDataSnapshot,
  RuleExpression,
} from "./types.ts";

/**
 * Creates a representation of a Firebase RuleDataSnapshots for use in rules.
 *
 * Note that `val()` is not type-specific so it's not available. Use `isString`,
 * `isNumber`, etc. to apply rules to `val()`.
 *
 * `data.isString(val => lessThan(val.length, 100))` is the same as
 * `data.isString() && data.val().length < 100`.
 *
 * https://firebase.google.com/docs/reference/security/database#ruledatasnapshot_methods
 */
export const createRuleDataSnapshot = (name: string): RuleDataSnapshot => {
  return createRuleObject(name, {
    isString: (valRule) => {
      const baseRule: RuleExpression<boolean> = createRuleBoolean(
        `${name}.isString()`,
      );
      return valRule
        ? allOf(baseRule, valRule(createRuleString(`${name}.val()`)))
        : baseRule;
    },
    isBoolean: (valRule) => {
      const baseRule = createRuleBoolean(`${name}.isBoolean()`);
      return valRule
        ? allOf(baseRule, valRule(createRuleBoolean(`${name}.val()`)))
        : baseRule;
    },
    isNumber: (valRule) => {
      const baseRule = createRuleBoolean(`${name}.isNumber()`);
      return valRule
        ? allOf(baseRule, valRule(createRuleNumber(`${name}.val()`)))
        : baseRule;
    },
    exists: () => {
      return createRuleBoolean(`${name}.exists()`);
    },
    hasChildren: (keys) => {
      return createRuleBoolean(`${name}.hasChildren(${toJSONString(keys)})`);
    },
    child: (...parts: PrimitiveOrExpression<string>[]) => {
      const key = parts.map((part) => toJSONString(part)).join(" + ");
      return createRuleDataSnapshot(`${name}.child(${key})`);
    },
  });
};
