import { toJSONString } from './ruleSerialisation'
import { PrimitiveOrExpression, RuleExpression } from './types'

/**
 * See:
 * https://firebase.google.com/docs/reference/security/database#operators
 */

const equal = <T>(value: PrimitiveOrExpression<T>, expected: PrimitiveOrExpression<T>): RuleExpression<boolean> => {
  return () => `(${toJSONString<T>(value)} === ${toJSONString<T>(expected)})`
}

const allOf = (...expressions: RuleExpression<boolean>[]): RuleExpression<boolean> => {
  if (expressions.length < 2) {
    const error = new Error(`unnecessary allOf called with ${expressions.length} arguments`)
    console.warn(error)
  }
  return () => '(' + expressions.map(v => v()).join(' && ') + ')'
}

const oneOf = (...expressions: RuleExpression<boolean>[]): RuleExpression<boolean> => {
  if (expressions.length < 2) {
    const error = new Error(`unnecessary oneOf called with ${expressions.length} arguments`)
    console.warn(error)
  }
  return () => '(' + expressions.map(v => v()).join(' || ') + ')'
}

const not = (expression: RuleExpression<boolean>): RuleExpression<boolean> => {
  return () => '!' + expression()
}

const greaterThan = (a: PrimitiveOrExpression<number>, b: PrimitiveOrExpression<number>): RuleExpression<boolean> => {
  return () => `(${toJSONString(a)} > ${toJSONString(b)})`
}

const lessThan = (a: PrimitiveOrExpression<number>, b: PrimitiveOrExpression<number>): RuleExpression<boolean> => {
  return () => `(${toJSONString(a)} < ${toJSONString(b)})`
}

const subtract = (a: PrimitiveOrExpression<number>, b: PrimitiveOrExpression<number>): RuleExpression<number> => {
  return () => `(${toJSONString(a)} - ${toJSONString(b)})`
}

const between = (value: PrimitiveOrExpression<number>, lower: PrimitiveOrExpression<number>, upper: PrimitiveOrExpression<number>): RuleExpression<boolean> => {
  return allOf(
    greaterThan(value, lower),
    lessThan(value, upper)
  )
}

export { equal, oneOf, allOf, subtract, between, lessThan, greaterThan, not }
