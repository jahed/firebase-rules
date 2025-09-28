import type { RuleExpression } from './types.ts'

/**
 * Returns a strictly `true` expression.
 *
 * `read(allowAll)` is the same as `{ ".read": false }`
 */
const allowAll: RuleExpression<boolean, boolean> = () => true

/**
 * Returns a strictly `false` expression.
 *
 * `read(denyAll)` is the same as `{ ".read": false }`
 */
const denyAll: RuleExpression<boolean, boolean> = () => false

export { allowAll, denyAll }
