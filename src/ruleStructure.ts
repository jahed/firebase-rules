import { createRuleString } from './ruleString'
import { RuleNode, RuleNodeFactory, RuleString } from './types'

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
