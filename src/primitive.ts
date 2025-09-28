import type { RuleExpression, RulePrimitive, Serialised } from "./types.ts";

/**
 * A representation of a Firebase Rule primitive such as a number or boolean.
 */
const createRulePrimitive = <T extends RulePrimitive>(
  name: string,
): RuleExpression<T, string> => {
  const val = () => name as Serialised<T>;

  // .length is a readonly value, so force it.
  Object.defineProperty(val, "length", {
    get: () => () => {
      throw new Error(`Primitive ${name} has no length.`);
    },
  });

  return val as typeof val & { length: never };
};

/**
 * A representation of a Firebase Rule boolean.
 */
export const createRuleBoolean = createRulePrimitive<boolean>;

/**
 * A representation of a Firebase Rule number.
 */
export const createRuleNumber = createRulePrimitive<number>;
