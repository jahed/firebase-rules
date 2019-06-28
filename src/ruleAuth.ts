import { createRuleString } from './ruleString'
import { RuleAuth } from './types'

const createRuleAuth = (name: string): RuleAuth => ({
  uid: createRuleString(`${name}.uid`)
})

export { createRuleAuth }
