import { createRuleObject } from "./object.ts";
import { createRuleNumber } from "./primitive.ts";
import { toJSONString } from "./serialise.ts";
import type { PrimitiveOrExpression, RuleString, Serialised } from "./types.ts";

/**
 * A representation of a Firebase Rule String.
 *
 * https://firebase.google.com/docs/reference/security/database#string_properties
 */
export const createRuleString = <T extends string>(
  name: string,
): RuleString<T> => {
  return createRuleObject(name, {
    matches: (regex: RegExp) => () =>
      `${name}.matches(${regex.toString()})` as Serialised<boolean>,
    contains: (substr: PrimitiveOrExpression<string>) => () =>
      `${name}.contains(${toJSONString(substr)})` as Serialised<boolean>,
    length: createRuleNumber(`${name}.length`),
  });
};

export const createRuleStringArray = (name: string): RuleString[] => {
  const arr: RuleString[] = [];
  return new Proxy(arr, {
    get: (_target, index) => createRuleString(`${name}[${String(index)}]`),
  });
};
