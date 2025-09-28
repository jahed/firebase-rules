import { createRuleString, createRuleStringArray } from "./string.ts";
import type {
  RuleAuth,
  RuleAuthToken,
  RuleAuthTokenFirebase,
} from "./types.ts";

const createRuleAuthTokenFirebase = (name: string): RuleAuthTokenFirebase => ({
  identities: {
    email: createRuleStringArray(`${name}["email"]`),
    phone: createRuleStringArray(`${name}["phone"]`),
    "google.com": createRuleStringArray(`${name}["google.com"]`),
    "facebook.com": createRuleStringArray(`${name}["facebook.com"]`),
    "github.com": createRuleStringArray(`${name}["github.com"]`),
    "twitter.com": createRuleStringArray(`${name}["twitter.com"]`),
  },
  sign_in_provider: createRuleString(`${name}.sign_in_provider`),
});

const createRuleAuthToken = (name: string): RuleAuthToken => ({
  email: createRuleString(`${name}.email`),
  email_verified: () => `${name}.email_verified`,
  phone_number: createRuleString(`${name}.phone_number`),
  name: createRuleString(`${name}.name`),
  sub: createRuleString(`${name}.sub`),
  firebase: createRuleAuthTokenFirebase(`${name}.firebase`),
  iss: createRuleString(`${name}.iss`),
  aud: createRuleString(`${name}.aud`),
  auth_time: () => `${name}.auth_time`,
  iat: () => `${name}.iat`,
  exp: () => `${name}.exp`,
});

export const createRuleAuth = (name: string): RuleAuth => ({
  uid: createRuleString(`${name}.uid`),
  provider: createRuleString(`${name}.provider`),
  token: createRuleAuthToken(`${name}.token`),
});
