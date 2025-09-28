import type { PrimitiveOrExpression, RuleExpression } from './types.ts'

/**
 * Converts a `RuleExpression` to its JSON string form.
 *
 * `toJSONString(equal(a, b))` renders `"(a === b)"`
 */
const toJSONString = <T>(a: PrimitiveOrExpression<T> | T[]): string => {
  if (typeof a === 'function') {
    return `${(a as RuleExpression<T>)()}`
  }
  return JSON.stringify(a)
}

export { toJSONString }
