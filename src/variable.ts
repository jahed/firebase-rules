import { createRuleAuth } from "./auth.ts";
import { createRuleDataSnapshot } from "./dataSnapshot.ts";
import { createRuleNumber } from "./primitive.ts";
import type { RuleAuth, RuleExpression } from "./types.ts";

/**
 * Representation of `auth` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#auth
 */
export const auth: RuleAuth = createRuleAuth("auth");

/**
 * Representation of `now` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#now
 */
export const now: RuleExpression<number> = createRuleNumber("now");

/**
 * Representation of `root` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#root
 */
export const root = createRuleDataSnapshot("root");

/**
 * Representation of `newData` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#newdata
 */
export const newData = createRuleDataSnapshot("newData");

/**
 * Representation of `data` for use in rule expressions.
 *
 * https://firebase.google.com/docs/reference/security/database#data
 */
export const data = createRuleDataSnapshot("data");
