import type { RuleExpression, RuleObject, Serialised } from "./types.ts";

/**
 * A Firebase Rule object such as string, data snapshot, auth.
 */
export const createRuleObject = <T extends RuleObject, P extends {}>(
  name: string,
  props: P,
): RuleExpression<T, string> & P => {
  const obj = () => name as Serialised<T>;

  if ("name" in props) {
    const n = props.name;
    Object.defineProperty(obj, "name", {
      get: () => n,
    });
    delete props.name;
  }

  if ("length" in props) {
    const n = props.length;
    Object.defineProperty(obj, "length", {
      get: () => n,
    });
    delete props.length;
  }

  Object.assign(obj, props);

  return obj as RuleExpression<T, string> & P;
};
