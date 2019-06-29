import { createRuleString } from './ruleString'
import { RuleNode, RuleNodeFactory, RuleString } from './types'

/**
 * Defines multiple properties with their own rules.
 *
 * ```
 * node(props({ one: node(), two: node() }))
 * ```
 *
 * is the same as
 *
 * ```
 * { "one": { }, "two": { } }
 * ```
 */
const props = (node: RuleNode): RuleNodeFactory => otherNode => {
  if ('$other' in node) {
    throw new Error('props are already enforced on node')
  }

  for (let key in node) {
    if (key.startsWith('$')) {
      throw new Error(`props node can't have parameter key ${key}`)
    }
  }

  return {
    ...otherNode,
    ...node,
    '$other': { '.validate': false }
  }
}

/**
 * Defines a parameter which you can use for inner rules.
 *
 * ```
 * node(param('$id', $id => node(validate(equal($id, auth.uid))) ))
 * ```
 *
 * is the same as
 *
 * ```
 * { "$id": { ".validate": "$id === auth.uid" } }
 * ```
 *
 * https://firebase.google.com/docs/reference/security/database#location
 */
const param = (key: string, fn: (key: RuleString) => RuleNode): RuleNodeFactory => otherNode => {
  if (!key.startsWith('$')) {
    throw new Error(`parameter key "${key}" must start with "$"`)
  }
  return {
    ...otherNode,
    [key]: fn(createRuleString(key))
  }
}

const node = (...factories: RuleNodeFactory[]): RuleNode => {
  return factories.reduce(
    (prev, factory) => factory(prev),
    {}
  )
}

export { node, props, param }
