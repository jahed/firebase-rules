import { RuleExpression } from './types'

/**
 * A representation of a Firebase Rule primitive such as a number or boolean.
 */
const createRulePrimitive = <T> (name: string): RuleExpression<T, string> => {
  const val = (): string => name

  // .length is a readonly value, so force it.
  Object.defineProperty(val, 'length', {
    get: () => () => {
      throw new Error(`Primitive ${name} has no length.`)
    }
  })

  return val
}

export { createRulePrimitive }
