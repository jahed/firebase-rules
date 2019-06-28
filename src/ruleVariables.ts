import { createRuleAuth } from './ruleAuth'
import { createRuleDataSnapshot } from './ruleDataSnapshot'
import { RuleAuth, RuleExpression } from './types'

/**
 * Representation of `auth` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#auth
 */
const auth: RuleAuth = createRuleAuth('auth')

/**
 * Representation of `now` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#now
 */
const now: RuleExpression<number> = () => 'now'

/**
 * Representation of `root` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#root
 */
const root = createRuleDataSnapshot('root')

/**
 * Representation of `newData` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#newdata
 */
const newData = createRuleDataSnapshot('newData')

/**
 * Representation of `data` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#data
 */
const data = createRuleDataSnapshot('data')

export { newData, data, root, now, auth }
