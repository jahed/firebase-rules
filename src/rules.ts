import { RuleExpression } from './types'

const allowAll: RuleExpression<boolean, boolean> = () => true
const denyAll: RuleExpression<boolean, boolean> = () => false

export { allowAll, denyAll }
