import { createRuleBoolean, createRuleNumber } from "./primitive.ts";
import { toJSONString } from "./serialise.ts";
import { createRuleString } from "./string.ts";
import type {
  ExpressionReturnType,
  PrimitiveOrExpression,
  RuleExpression,
  RuleString,
  Serialised,
} from "./types.ts";

/**
 * Does an equality check between `a` and `b`.
 *
 * `equal(a, b)` is equivalent to `a === b`
 */
export const equal = <T extends ExpressionReturnType>(
  a: PrimitiveOrExpression<T>,
  b: PrimitiveOrExpression<T>,
): RuleExpression<boolean> => {
  return createRuleBoolean(`(${toJSONString(a)} === ${toJSONString(b)})`);
};

/**
 * Does an inequality check between `a` and `b`.
 *
 * `notEqual(a, b)` is equivalent to `a !== b`
 */
export const notEqual = <T extends ExpressionReturnType>(
  a: PrimitiveOrExpression<T>,
  b: PrimitiveOrExpression<T>,
): RuleExpression<boolean> => {
  return createRuleBoolean(`(${toJSONString(a)} !== ${toJSONString(b)})`);
};

/**
 * Requires all of its expressions to be `true`.
 *
 * `allOf(a, b, c)` is equivalent to `a && b && c`.
 */
export const allOf = (
  ...expressions: RuleExpression<boolean>[]
): RuleExpression<boolean> => {
  if (expressions.length < 2) {
    const error = new Error(
      `unnecessary allOf called with ${expressions.length} arguments`,
    );
    console.warn(error);
  }
  return createRuleBoolean(`(${expressions.map((v) => v()).join(" && ")})`);
};

/**
 * Requires at least one of its expressions to be `true`.
 *
 * `oneOf(a, b, c)` is equivalent to `a || b || c`.
 */
export const oneOf = (
  ...expressions: RuleExpression<boolean>[]
): RuleExpression<boolean> => {
  if (expressions.length < 2) {
    const error = new Error(
      `unnecessary oneOf called with ${expressions.length} arguments`,
    );
    console.warn(error);
  }
  return createRuleBoolean(`(${expressions.map((v) => v()).join(" || ")})`);
};

/**
 * Negates an expression.
 *
 * `not(a)` is equivalent to `!a`.
 */
export const not = (
  expression: RuleExpression<boolean>,
): RuleExpression<boolean> => {
  return createRuleBoolean("!" + expression());
};

/**
 * Checks if `a` is greater than `b`.
 *
 * `greaterThan(a, b)` is equivalent to `a > b`.
 */
export const greaterThan = (
  a: PrimitiveOrExpression<number>,
  b: PrimitiveOrExpression<number>,
): RuleExpression<boolean> => {
  return createRuleBoolean(`(${toJSONString(a)} > ${toJSONString(b)})`);
};

/**
 * Checks if `a` is less than `b`.
 *
 * `lessThan(a, b)` is equivalent to `a < b`.
 */
export const lessThan = (
  a: PrimitiveOrExpression<number>,
  b: PrimitiveOrExpression<number>,
): RuleExpression<boolean> => {
  return createRuleBoolean(`(${toJSONString(a)} < ${toJSONString(b)})`);
};

/**
 * Calculates `b` added to `a` and so on.
 *
 * `add(a, b, c, ...)` is equivalent to `a + b + c ...`.
 */
export const add = (
  ...args: PrimitiveOrExpression<number>[]
): RuleExpression<number> => {
  return createRuleNumber(`(${args.map((s) => toJSONString(s)).join(" + ")})`);
};

/**
 * Calculates `b` subtracted from `a` and so on.
 *
 * `subtract(a, b, c, ...)` is equivalent to `a - b - c ...`.
 */
export const subtract = (
  ...args: PrimitiveOrExpression<number>[]
): RuleExpression<number> => {
  return () =>
    `(${args.map((s) => toJSONString(s)).join(" - ")})` as Serialised<number>;
};

/**
 * Negates `a`.
 *
 * `negate(a)` is equivalent to `-a`.
 */
export const negate = (
  a: PrimitiveOrExpression<number>,
): RuleExpression<number> => {
  return () => `(-(${toJSONString(a)}))` as Serialised<number>;
};

/**
 * Calculates `b` multiplied by `a` and so on.
 *
 * `multiply(a, b, c, ...)` is equivalent to `a * b * c ...`.
 */
export const multiply = (
  ...args: PrimitiveOrExpression<number>[]
): RuleExpression<number> => {
  return () =>
    `(${args.map((s) => toJSONString(s)).join(" - ")})` as Serialised<number>;
};

/**
 * Calculates `b` divided by `a` and so on.
 *
 * `divide(a, b, c, ...)` is equivalent to `a / b / c ...`.
 */
export const divide = (
  ...args: PrimitiveOrExpression<number>[]
): RuleExpression<number> => {
  return () =>
    `(${args.map((s) => toJSONString(s)).join(" / ")})` as Serialised<number>;
};

/**
 * Calculates `a` modulus `b` and so on.
 *
 * `modulus(a, b, c, ...)` is equivalent to `a % b % c ...`.
 */
export const modulus = (
  ...args: PrimitiveOrExpression<number>[]
): RuleExpression<number> => {
  return () =>
    `(${args.map((s) => toJSONString(s)).join(" % ")})` as Serialised<number>;
};

/**
 * Checks if `a` is between `lower` and `upper`, exclusive.
 *
 * `between(a, b, c)` is equivalent to `a > b && a < c`.
 */
export const between = (
  value: PrimitiveOrExpression<number>,
  lower: PrimitiveOrExpression<number>,
  upper: PrimitiveOrExpression<number>,
): RuleExpression<boolean> => {
  return allOf(greaterThan(value, lower), lessThan(value, upper));
};

/**
 * Calculates `b` concatenated to `a` and so on.
 *
 * `concat(a, b, ...)` is equivalent to `a + b + c + ...`.
 */
export const concat = (
  ...args: PrimitiveOrExpression<string>[]
): RuleString<string> => {
  return createRuleString(`(${args.map((s) => toJSONString(s)).join(" + ")})`);
};
