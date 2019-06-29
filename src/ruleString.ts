import { toJSONString } from './ruleSerialisation'
import { RuleString } from './types'

/**
 * A representation of a Firebase Rule String.
 *
 * https://firebase.google.com/docs/reference/security/database#string_properties
 */
const createRuleString = (name: string): RuleString => {
  const str = (): string => name
  str.matches = (regex: RegExp) => () => `${name}.matches(${regex.toString()})`
  str.contains = (substr: string) => () => `${name}.contains(${toJSONString(substr)})`

  // .length is a readonly value, so force it.
  Object.defineProperty(str, 'length', {
    get: () => () => `${name}.length`
  })

  return str as RuleString
}

const createRuleStringArray = (name: string): RuleString[] => {
  const arr: RuleString[] = []
  return new Proxy(arr, {
    get: (_target, index) => createRuleString(`${name}[${String(index)}]`)
  })
}

export { createRuleString, createRuleStringArray }
