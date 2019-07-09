import { toJSONString } from './ruleSerialisation'
import { PrimitiveOrExpression, RuleDataSnapshot, RuleExpression, RulePriority } from './types'
import { allOf } from './ruleOperators'
import { createRuleString } from './ruleString'
import { createRulePrimitive } from './rulePrimitive'

/**
 * Creates a representation of Priority. Priority can be a number, string or
 * null so to use it safely with operators, additional "assuming" methods have
 * been added, similar to "is" but they are not enforced on Firebase's end, the
 * operators are.
 */
const createRulePriority = (name: string): RulePriority => {
  const rule: RulePriority = () => name
  rule.assumingString = valRule => valRule(createRuleString(name))
  rule.assumingNumber = valRule => valRule(createRulePrimitive(name))
  return rule
}

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
const createRuleDataSnapshot = (name: string): RuleDataSnapshot => ({
  child: (...parts: PrimitiveOrExpression<string>[]) => {
    const key = parts
      .map(part => toJSONString(part))
      .join(' + ')
    return createRuleDataSnapshot(`${name}.child(${key})`)
  },
  parent: () => createRuleDataSnapshot(`${name}.parent()`),
  hasChild: key => () => `${name}.hasChild(${toJSONString(key)})`,
  hasChildren: keys => () => `${name}.hasChildren(${toJSONString(keys)})`,
  exists: () => () => `${name}.exists()`,
  getPriority: () => createRulePriority(`${name}.getPriority()`),
  isNumber: valRule => {
    const baseRule: RuleExpression<boolean> = () => `${name}.isNumber()`
    return valRule
      ? allOf(baseRule, valRule(createRulePrimitive(`${name}.val()`)))
      : baseRule
  },
  isString: valRule => {
    const baseRule: RuleExpression<boolean> = () => `${name}.isString()`
    return valRule
      ? allOf(baseRule, valRule(createRuleString(`${name}.val()`)))
      : baseRule
  },
  isBoolean: valRule => {
    const baseRule: RuleExpression<boolean> = () => `${name}.isBoolean()`
    return valRule
      ? allOf(baseRule, valRule(createRulePrimitive(`${name}.val()`)))
      : baseRule
  }
})

export { createRuleDataSnapshot }
