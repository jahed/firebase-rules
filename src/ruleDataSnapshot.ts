import { toJSONString } from './ruleSerialisation'
import { PrimitiveOrExpression, RuleDataSnapshot, RuleExpression } from './types'
import { allOf } from './ruleOperators'
import { createRuleString } from './ruleString'

/**
 * Creates a representation of a Firebase RuleDataSnapshots for use in rules.
 *
 * Note that `val()` is not type-specific. The only type of `val()` that has an
 * interface is `String`. To use those interfaces, use `isString`.
 *
 * `data.isString(val => lessThan(val.length, 100))` is the same as
 * `data.isString() && data.val().length < 100`.
 *
 * https://firebase.google.com/docs/reference/security/database#ruledatasnapshot_methods
 */
const createRuleDataSnapshot = <ValueType> (name: string): RuleDataSnapshot<ValueType> => ({
  isString: valRule => {
    const baseRule: RuleExpression<boolean> = () => `${name}.isString()`
    return valRule
      ? allOf(baseRule, valRule(createRuleString(`${name}.val()`)))
      : baseRule
  },
  isBoolean: () => () => `${name}.isBoolean()`,
  isNumber: () => () => `${name}.isNumber()`,
  exists: () => () => `${name}.exists()`,
  val: (): RuleExpression<ValueType> => () => `${name}.val()`,
  hasChildren: keys => () => `${name}.hasChildren(${toJSONString(keys)})`,
  child: <ChildValueType> (...parts: PrimitiveOrExpression<string>[]) => {
    const key = parts
      .map(part => toJSONString(part))
      .join(' + ')
    return createRuleDataSnapshot<ChildValueType>(`${name}.child(${key})`)
  }
})

export { createRuleDataSnapshot }
