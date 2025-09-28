import type {
  ExpressionReturnType,
  ExpressionSerialisedType,
  PrimitiveOrExpression,
  Serialised,
} from "./types.ts";

/**
 * Converts a `RuleExpression` to its JSON string form.
 *
 * `toJSONString(equal(a, b))` renders `"(a === b)"`
 */
export const toJSONString = <
  T extends ExpressionReturnType,
  S extends ExpressionSerialisedType,
>(
  a: PrimitiveOrExpression<T, S> | T[],
): Serialised<T, S> => {
  if (typeof a === "function") {
    return a();
  }
  return JSON.stringify(a) as Serialised<T, S>;
};
