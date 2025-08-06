import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
	...authTables,
	users: defineTable({
		name: v.string(),
		email: v.string(),
		image: v.optional(v.string()),
		emailVerificationTime: v.optional(v.number()),
		role: v.optional(
			v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
		),
	}).index("email", ["email"]),

	workspaces: defineTable({
		name: v.string(),
		slug: v.string(),
		ownerId: v.id("users"),
		imageUrl: v.optional(v.string()),
	}).index("by_owner", ["ownerId"]),

	members: defineTable({
		userId: v.id("users"),
		orgId: v.id("workspaces"),
		role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
		name: v.string(),
		email: v.string(),
	})
		.index("by_user", ["userId"])
		.index("by_org", ["orgId"])
		.index("by_email", ["email"]),

	invitations: defineTable({
		email: v.string(),
		orgId: v.id("workspaces"),
		role: v.string(),
		status: v.string(),
		token: v.string(),
	})
		.index("by_org", ["orgId"])
		.index("by_email", ["email"])
		.index("by_token", ["token"]),

	forms: defineTable({
		title: v.string(),
		userId: v.id("users"),
		name: v.string(),
		orgId: v.id("workspaces"),
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
		formId: v.id("forms"),
		isRequired: v.boolean(),
	}).index("by_form", ["formId", "position"]),

	responses: defineTable({
		response: v.union(v.string(), v.array(v.string())),
		questionId: v.id("questions"),
		formId: v.id("forms"),
	})
		.index("by_form", ["formId"])
		.index("by_question", ["questionId"]),
});
