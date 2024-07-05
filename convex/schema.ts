import { v, Validator } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export const userSchema = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  image: v.optional(v.string()),
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.union(
    v.literal("email"),
    v.literal("oidc"),
    v.literal("oauth"),
    v.literal("webauthn")
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string() as Validator<Lowercase<string>>),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const authenticatorSchema = {
  credentialID: v.string(),
  userId: v.id("users"),
  providerAccountId: v.string(),
  credentialPublicKey: v.string(),
  counter: v.number(),
  credentialDeviceType: v.string(),
  credentialBackedUp: v.boolean(),
  transports: v.optional(v.string()),
};

const authTables = {
  users: defineTable(userSchema).index("email", ["email"]),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index("identifierToken", [
    "identifier",
    "token",
  ]),
  authenticators: defineTable(authenticatorSchema)
    .index("userId", ["userId"])
    .index("credentialID", ["credentialID"]),
};

export default defineSchema({
  ...authTables,

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    imageUrl: v.optional(v.string()),
  }).index("by_owner", ["ownerId"]),

  userOrganizations: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"]),

  forms: defineTable({
    title: v.string(),
    userId: v.id("users"),
    name: v.string(),
    orgId: v.id("organizations"),
    isPublished: v.boolean(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"]),

  questions: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    choices: v.optional(v.array(v.string())),
    position: v.number(),
    formId: v.string(),
  }).index("by_form", ["formId", "position"]),

  responses: defineTable({
    response: v.union(v.string(), v.array(v.string())),
    questionId: v.string(),
    formId: v.string(),
  })
    .index("by_form", ["formId"])
    .index("by_question", ["questionId"]),
});
