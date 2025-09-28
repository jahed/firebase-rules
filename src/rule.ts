import type { IndexField, IndexRuleType, RuleType } from "./types.ts";

/**
 * Creates a `.read` rule with the given `expression`.
 *
 * `read(allowAll)` is the same as `{ ".read": true }`
 *
 * https://firebase.google.com/docs/reference/security/database#read
 */
export const read: RuleType =
  (expression) =>
  (node = {}) => {
    if (".read" in node) {
      throw new Error(".read rule already exists on node");
    }

    return {
      ...node,
      ".read": expression(),
    };
  };

/**
 * Creates a `.write` rule with the given `expression`.
 *
 * `write(allowAll)` is the same as `{ ".write": true }`
 *
 * https://firebase.google.com/docs/reference/security/database#write
 */
export const write: RuleType =
  (expression) =>
  (node = {}) => {
    if (".write" in node) {
      throw new Error(".write rule already exists on node");
    }

    return {
      ...node,
      ".write": expression(),
    };
  };

/**
 * Creates a `.validate` rule  with the given `expression`.
 *
 * `validate(allowAll)` is the same as `{ ".validate": true }`
 *
 * https://firebase.google.com/docs/reference/security/database#validate
 */
export const validate: RuleType =
  (expression) =>
  (node = {}) => {
    if (".validate" in node) {
      throw new Error(".validate rule already exists on node");
    }

    return {
      ...node,
      ".validate": expression(),
    };
  };

/**
 * Creates an `.indexOn` rule  with the given string `fields`.
 *
 * `indexOn(value, 'custom')` is the same as `{ ".indexOn": [".value", "custom"] }"`
 *
 * https://firebase.google.com/docs/reference/security/database#indexon
 */
export const indexOn: IndexRuleType =
  (...fields: IndexField[]) =>
  (node = {}) => {
    if (".indexOn" in node) {
      throw new Error(".indexOn rule already exists on node");
    }

    return {
      ...node,
      ".indexOn": fields,
    };
  };

/**
 * Representation of `".value"` to be used in `indexOn` rules.
 */
export const value: IndexField = ".value";
