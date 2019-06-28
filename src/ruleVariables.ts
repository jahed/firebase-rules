import { createRuleDataSnapshot } from './ruleDataSnapshot'
import { createRuleString } from './ruleString'
import { RuleExpression } from './types'

/**
 * See:
 * https://firebase.google.com/docs/reference/security/database#variables
 */

type Auth = {
  uid: RuleExpression<string>;
}

const auth: Auth = {
  uid: createRuleString('auth.uid')
}

const now: RuleExpression<number> = () => 'now'

const newData = createRuleDataSnapshot('newData')
const data = createRuleDataSnapshot('data')
const root = createRuleDataSnapshot('root')

export { newData, data, root, now, auth }
