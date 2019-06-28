export type RuleExpression<_ReturnType = string | boolean | number, SerialisedType = string> = () => SerialisedType
export type PrimitiveOrExpression<T = number | string | boolean, R = string | boolean> = T | RuleExpression<T, R>

export type RuleType = (validator: RuleExpression<boolean, string | boolean>) => RuleNodeFactory

export type IndexRuleType = (...fields: IndexField[]) => RuleNodeFactory
export type IndexField = string

export type RuleNodeFactory = (node?: RuleNode) => RuleNode

export type RuleNode = { [key: string]: RuleNode | string | boolean | string[] }

export type Rules = { rules: RuleNode }

export type RuleString = RuleExpression<string> & {
  matches: (regexp: RegExp) => RuleExpression<boolean>;
  contains: (substr: string) => RuleExpression<boolean>;
  length: RuleExpression<number>;
}

export type StringRule = (val: RuleString) => RuleExpression<boolean>

export type RuleDataSnapshot<ValueType> = {
  isString: (rule?: StringRule) => RuleExpression<boolean>;
  isBoolean: () => RuleExpression<boolean>;
  isNumber: () => RuleExpression<boolean>;
  exists: () => RuleExpression<boolean>;
  val: () => RuleExpression<ValueType>;
  hasChildren: (keys: string[]) => RuleExpression<boolean>;
  child: <ChildValueType> (...parts: PrimitiveOrExpression<string>[]) => RuleDataSnapshot<ChildValueType>;
}

export type RuleAuth = {
  uid: RuleExpression<string>;
}
