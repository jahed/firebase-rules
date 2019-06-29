export type RuleExpression<_ReturnType = string | boolean | number, SerialisedType = string> = () => SerialisedType
export type PrimitiveOrExpression<T = number | string | boolean, R = string | boolean> = T | RuleExpression<T, R>

export type RuleType = (validator: RuleExpression<boolean, string | boolean>) => RuleNodeFactory

export type IndexRuleType = (...fields: IndexField[]) => RuleNodeFactory
export type IndexField = string

export type RuleNodeFactory = (node?: RuleNode) => RuleNode

export type RuleNode = { [key: string]: RuleNode | string | boolean | string[] }

export type Rules = { rules: RuleNode }

export type RuleString = RuleExpression<string, string> & {
  matches: (regexp: RegExp) => RuleExpression<boolean, string>;
  contains: (substr: string) => RuleExpression<boolean, string>;
  length: RuleExpression<number, string>;
}

export type StringRule = (val: RuleString) => RuleExpression<boolean, string>
export type BooleanRule = (val: RuleExpression<boolean, string>) => RuleExpression<boolean, string>
export type NumberRule = (val: RuleExpression<number, string>) => RuleExpression<boolean, string>

export type RuleDataSnapshot = {
  isString: (rule?: StringRule) => RuleExpression<boolean, string>;
  isBoolean: (rule?: BooleanRule) => RuleExpression<boolean, string>;
  isNumber: (rule?: NumberRule) => RuleExpression<boolean, string>;
  exists: () => RuleExpression<boolean, string>;
  hasChildren: (keys: string[]) => RuleExpression<boolean, string>;
  child: (...parts: PrimitiveOrExpression<string, string>[]) => RuleDataSnapshot;
}

export type RuleAuth = {
  uid: RuleString;
}
