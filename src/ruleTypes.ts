import { IndexField, IndexRuleType, RuleType } from './types'

/**
 * See:
 * https://firebase.google.com/docs/reference/security/database#rule_types
 */

const validate: RuleType = expression => (node = {}) => {
  if ('.validate' in node) {
    throw new Error('.validate rule already exists on node')
  }

  return {
    ...node,
    '.validate': expression()
  }
}

const write: RuleType = expression => (node = {}) => {
  if ('.write' in node) {
    throw new Error('.write rule already exists on node')
  }

  return {
    ...node,
    '.write': expression()
  }
}

const read: RuleType = expression => (node = {}) => {
  if ('.read' in node) {
    throw new Error('.read rule already exists on node')
  }

  return {
    ...node,
    '.read': expression()
  }
}

const indexOn: IndexRuleType = (...fields: IndexField[]) => (node = {}) => {
  if ('.indexOn' in node) {
    throw new Error('.indexOn rule already exists on node')
  }

  return {
    ...node,
    '.indexOn': fields
  }
}

const value: IndexField = '.value'

export { validate, read, write, indexOn, value }
