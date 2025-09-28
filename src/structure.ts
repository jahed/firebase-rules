import { createRuleString } from "./string.ts";
import type { RuleNode, RuleNodeFactory, RuleString } from "./types.ts";

/**
 * Defines multiple properties with their own rules.
 *
 * ```
 * node(props({ one: node(), two: node() }))
 * ```
 *
 * is the same as
 *
 * ```
 * { "one": { }, "two": { } }
 * ```
 */
export const props =
  (node: RuleNode): RuleNodeFactory =>
  (otherNode) => {
    if ("$other" in node) {
      throw new Error("props are already enforced on node");
    }

    for (let key in node) {
      if (key.startsWith("$")) {
        throw new Error(`props node can't have parameter key ${key}`);
      }
    }

    return {
      ...otherNode,
      ...node,
      $other: { ".validate": false },
    };
  };

/**
 * Defines a parameter which you can use for inner rules.
 *
 * ```
 * node(param('$id', $id => node(validate(equal($id, auth.uid))) ))
 * ```
 *
 * is the same as
 *
 * ```
 * { "$id": { ".validate": "$id === auth.uid" } }
 * ```
 *
 * https://firebase.google.com/docs/reference/security/database#location
 */
export const param = (fn: ($key: RuleString) => RuleNode): RuleNodeFactory => {
  return (otherNode) => {
    const key = extractParamKey(fn);
    if (!key) {
      throw new Error(
        `param($key => ...) must have take only one parameter starting with $.`,
      );
    }
    return {
      ...otherNode,
      [key]: fn(createRuleString(key)),
    };
  };
};

export const extractParamKey = (fn: Function): string | undefined => {
  const [, key] = /(\$[^\s,)]+)/.exec(fn.toString()) || [];
  return key;
};

export const node = (...factories: RuleNodeFactory[]): RuleNode => {
  return factories.reduce((prev, factory) => factory(prev), {});
};
