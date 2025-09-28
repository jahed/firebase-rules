import { toJSONString } from './ruleSerialisation.ts'
import type { PrimitiveOrExpression, RuleExpression } from './types.ts'

/**
 * Does an equality check between `a` and `b`.
 *
 * `equal(a, b)` is equivalent to `a === b`
 */
const equal = <T>(a: PrimitiveOrExpression<T>, b: PrimitiveOrExpression<T>): RuleExpression<boolean> => {
  return () => `(${toJSONString<T>(a)} === ${toJSONString<T>(b)})`
}

/**
 * Requires all of its expressions to be `true`.
 *
 * `allOf(a, b, c)` is equivalent to `a && b && c`.
 */
const allOf = (...expressions: RuleExpression<boolean>[]): RuleExpression<boolean> => {
  if (expressions.length < 2) {
    const error = new Error(`unnecessary allOf called with ${expressions.length} arguments`)
    console.warn(error)
  }
  return () => '(' + expressions.map(v => v()).join(' && ') + ')'
}

/**
 * Requires at least one of its expressions to be `true`.
 *
 * `oneOf(a, b, c)` is equivalent to `a || b || c`.
 */
const oneOf = (...expressions: RuleExpression<boolean>[]): RuleExpression<boolean> => {
  if (expressions.length < 2) {
    const error = new Error(`unnecessary oneOf called with ${expressions.length} arguments`)
    console.warn(error)
  }
  return () => '(' + expressions.map(v => v()).join(' || ') + ')'
}

/**
 * Negates an expression.
 *
 * `not(a)` is equivalent to `!a`.
 */
const not = (expression: RuleExpression<boolean>): RuleExpression<boolean> => {
  return () => '!' + expression()
}

/**
 * Checks if `a` is greater than `b`.
 *
 * `greaterThan(a, b)` is equivalent to `a > b`.
 */
const greaterThan = (a: PrimitiveOrExpression<number>, b: PrimitiveOrExpression<number>): RuleExpression<boolean> => {
  return () => `(${toJSONString(a)} > ${toJSONString(b)})`
}

/**
 * Checks if `a` is less than `b`.
 *
 * `lessThan(a, b)` is equivalent to `a < b`.
 */
const lessThan = (a: PrimitiveOrExpression<number>, b: PrimitiveOrExpression<number>): RuleExpression<boolean> => {
  return () => `(${toJSONString(a)} < ${toJSONString(b)})`
}

/**
 * Calculates `b` added to `a` and so on.
 *
 * `add(a, b, c, ...)` is equivalent to `a + b + c ...`.
 */
const add = (...args: PrimitiveOrExpression<number>[]): RuleExpression<number> => {
  return () => `(${args.map(s => toJSONString(s)).join(' + ')})`
}

/**
 * Calculates `b` subtracted from `a` and so on.
 *
 * `subtract(a, b, c, ...)` is equivalent to `a - b - c ...`.
 */
const subtract = (...args: PrimitiveOrExpression<number>[]): RuleExpression<number> => {
  return () => `(${args.map(s => toJSONString(s)).join(' - ')})`
}

/**
 * Negates `a`.
 *
 * `negate(a)` is equivalent to `-a`.
 */
const negate = (a: PrimitiveOrExpression<number>): RuleExpression<number> => {
  return () => `(-(${toJSONString(a)}))`
}

/**
 * Calculates `b` multiplied by `a` and so on.
 *
 * `multiply(a, b, c, ...)` is equivalent to `a * b * c ...`.
 */
const multiply = (...args: PrimitiveOrExpression<number>[]): RuleExpression<number> => {
  return () => `(${args.map(s => toJSONString(s)).join(' - ')})`
}

/**
 * Calculates `b` divided by `a` and so on.
 *
 * `divide(a, b, c, ...)` is equivalent to `a / b / c ...`.
 */
const divide = (...args: PrimitiveOrExpression<number>[]): RuleExpression<number> => {
  return () => `(${args.map(s => toJSONString(s)).join(' / ')})`
}

/**
 * Calculates `a` modulus `b` and so on.
 *
 * `modulus(a, b, c, ...)` is equivalent to `a % b % c ...`.
 */
const modulus = (...args: PrimitiveOrExpression<number>[]): RuleExpression<number> => {
  return () => `(${args.map(s => toJSONString(s)).join(' % ')})`
}

/**
 * Checks if `a` is between `lower` and `upper`, exclusive.
 *
 * `between(a, b, c)` is equivalent to `a > b && a < c`.
 */
const between = (value: PrimitiveOrExpression<number>, lower: PrimitiveOrExpression<number>, upper: PrimitiveOrExpression<number>): RuleExpression<boolean> => {
  return allOf(
    greaterThan(value, lower),
    lessThan(value, upper)
  )
}

/**
 * Calculates `b` concatenated to `a` and so on.
 *
 * `concat(a, b, ...)` is equivalent to `a + b + c + ...`.
 */
const concat = (...args: PrimitiveOrExpression<string>[]): RuleExpression<string> => {
  return () => `(${args.map(s => toJSONString(s)).join(' + ')})`
}

export { equal, oneOf, allOf, add, subtract, multiply, divide, modulus, between, lessThan, greaterThan, not, negate, concat }
