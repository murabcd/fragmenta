import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  forms: defineTable({
    title: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    orgId: v.string(),
    isPublished: v.boolean(),
  })
    .index("by_org", ["orgId"])
    .index("by_author", ["authorId"]),

  questions: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    formId: v.string(),
  }).index("by_form", ["formId"]),
});
