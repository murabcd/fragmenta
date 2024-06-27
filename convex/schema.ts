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
