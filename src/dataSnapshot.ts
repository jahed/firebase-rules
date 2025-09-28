import { toJSONString } from "./serialise.ts";
import type {
  PrimitiveOrExpression,
  RuleDataSnapshot,
  RuleExpression,
} from "./types.ts";
import { allOf } from "./operator.ts";
import { createRuleString } from "./string.ts";
import { createRulePrimitive } from "./primitive.ts";

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
export const createRuleDataSnapshot = (name: string): RuleDataSnapshot => ({
  isString: (valRule) => {
    const baseRule: RuleExpression<boolean> = () => `${name}.isString()`;
    return valRule
      ? allOf(baseRule, valRule(createRuleString(`${name}.val()`)))
      : baseRule;
  },
  isBoolean: (valRule) => {
    const baseRule: RuleExpression<boolean> = () => `${name}.isBoolean()`;
    return valRule
      ? allOf(baseRule, valRule(createRulePrimitive(`${name}.val()`)))
      : baseRule;
  },
  isNumber: (valRule) => {
    const baseRule: RuleExpression<boolean> = () => `${name}.isNumber()`;
    return valRule
      ? allOf(baseRule, valRule(createRulePrimitive(`${name}.val()`)))
      : baseRule;
  },
  exists: () => () => `${name}.exists()`,
  hasChildren: (keys) => () => `${name}.hasChildren(${toJSONString(keys)})`,
  child: (...parts: PrimitiveOrExpression<string>[]) => {
    const key = parts.map((part) => toJSONString(part)).join(" + ");
    return createRuleDataSnapshot(`${name}.child(${key})`);
  },
});
