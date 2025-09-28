import { createRuleNumber } from "./primitive.ts";
import { toJSONString } from "./serialise.ts";
import type {
  PrimitiveOrExpression,
  RuleExpression,
  RuleString,
  Serialised,
} from "./types.ts";

/**
 * A representation of a Firebase Rule String.
 *
 * https://firebase.google.com/docs/reference/security/database#string_properties
 */
export const createRuleString = <T extends string>(
  name: string,
): RuleString<T> => {
  const str = () => name as Serialised<T>;
  str.matches = (regex: RegExp) => () =>
    `${name}.matches(${regex.toString()})` as Serialised<boolean>;
  str.contains = (substr: PrimitiveOrExpression<string>) => () =>
    `${name}.contains(${toJSONString(substr)})` as Serialised<boolean>;

  // .length is a readonly value, so force it.
  Object.defineProperty(str, "length", {
    get: () => createRuleNumber(`${name}.length`),
  });

  return str as typeof str & { length: RuleExpression<number> };
};

export const createRuleStringArray = (name: string): RuleString[] => {
  const arr: RuleString[] = [];
  return new Proxy(arr, {
    get: (_target, index) => createRuleString(`${name}[${String(index)}]`),
  });
};
