import type { RuleExpression, Serialised } from "./types.ts";

/**
 * Returns a strictly `true` expression.
 *
 * `read(allowAll)` is the same as `{ ".read": false }`
 */
export const allowAll: RuleExpression<boolean, boolean> = () =>
  true as Serialised<boolean, boolean>;

/**
 * Returns a strictly `false` expression.
 *
 * `read(denyAll)` is the same as `{ ".read": false }`
 */
export const denyAll: RuleExpression<boolean, boolean> = () =>
  false as Serialised<boolean, boolean>;
