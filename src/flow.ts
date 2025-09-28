import { allOf, not, oneOf } from "./operator.ts";
import type { RuleExpression } from "./types.ts";

export const branch = (
  test: RuleExpression<boolean>,
  success: RuleExpression<boolean>,
  failure?: RuleExpression<boolean>,
): RuleExpression<boolean> => {
  if (failure) {
    return oneOf(allOf(test, success), allOf(not(test), failure));
  }
  return allOf(test, success);
};
