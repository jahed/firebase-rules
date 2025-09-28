declare const __brand: unique symbol;
type Brand<B> = { [__brand]: B };

export type RulePrimitive = number | boolean | null;
export type RuleObject = string | object;

export type ExpressionReturnType = RulePrimitive | RuleObject;
export type ExpressionSerialisedType = string | boolean;

export type Serialised<
  ReturnType extends ExpressionReturnType = ExpressionReturnType,
  SerialisedType extends ExpressionSerialisedType = string,
> = SerialisedType & Brand<ReturnType>;

export type RuleExpression<
  ReturnType extends ExpressionReturnType = ExpressionReturnType,
  SerialisedType extends ExpressionSerialisedType = string,
> = () => Serialised<ReturnType, SerialisedType>;

export type PrimitiveOrExpression<
  T extends ExpressionReturnType = ExpressionReturnType,
  R extends ExpressionSerialisedType = ExpressionSerialisedType,
> = T | RuleExpression<T, R>;

export type RuleType = (
  validator: RuleExpression<boolean, ExpressionSerialisedType>,
) => RuleNodeFactory;

export type IndexRuleType = (...fields: IndexField[]) => RuleNodeFactory;
export type IndexField = string;

export type RuleNodeFactory = (node?: RuleNode) => RuleNode;

export type RuleNode = {
  [key: string]: RuleNode | string | boolean | string[];
};

export type Rules = { rules: RuleNode };

export type RuleString<T extends string = string> = RuleExpression<
  T,
  string
> & {
  matches: (regexp: RegExp) => RuleExpression<boolean, string>;
  contains: (
    substr: PrimitiveOrExpression<string>,
  ) => RuleExpression<boolean, string>;
  length: RuleExpression<number, string>;
};

export type StringRule = (val: RuleString) => RuleExpression<boolean, string>;
export type BooleanRule = (
  val: RuleExpression<boolean, string>,
) => RuleExpression<boolean, string>;
export type NumberRule = (
  val: RuleExpression<number, string>,
) => RuleExpression<boolean, string>;

export type RuleDataSnapshot = RuleExpression<object, string> & {
  isString: (rule?: StringRule) => RuleExpression<boolean, string>;
  isBoolean: (rule?: BooleanRule) => RuleExpression<boolean, string>;
  isNumber: (rule?: NumberRule) => RuleExpression<boolean, string>;
  exists: () => RuleExpression<boolean, string>;
  hasChildren: (keys: string[]) => RuleExpression<boolean, string>;
  child: (
    ...parts: PrimitiveOrExpression<string, string>[]
  ) => RuleDataSnapshot;
};

export type RuleSignInProvider =
  | "custom"
  | "password"
  | "phone"
  | "anonymous"
  | "google.com"
  | "facebook.com"
  | "github.com"
  | "twitter.com";

export type RuleAuthTokenFirebase = {
  identities: {
    email: RuleString[];
    phone: RuleString[];
    "google.com": RuleString[];
    "facebook.com": RuleString[];
    "github.com": RuleString[];
    "twitter.com": RuleString[];
  };
  sign_in_provider: RuleString<RuleSignInProvider>;
};

export type RuleAuthToken = {
  email: RuleString;
  email_verified: RuleExpression<boolean, string>;
  phone_number: RuleString;
  name: RuleString;
  sub: RuleString;
  firebase: RuleAuthTokenFirebase;
  iss: RuleString;
  aud: RuleString;
  auth_time: RuleExpression<number, string>;
  iat: RuleExpression<number, string>;
  exp: RuleExpression<number, string>;
};

export type RuleAuth = RuleExpression<object, string> & {
  uid: RuleString;
  provider: RuleString;
  token: RuleAuthToken;
};
