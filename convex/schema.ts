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
});
