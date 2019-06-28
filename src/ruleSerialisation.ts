import { PrimitiveOrExpression, RuleExpression } from './types'

const toJSONString = <T>(a: PrimitiveOrExpression<T> | string[]): string => {
  if (typeof a === 'function') {
    return `${(a as RuleExpression<T>)()}`
  }
  return JSON.stringify(a)
}

export { toJSONString }
