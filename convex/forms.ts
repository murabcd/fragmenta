import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

import type { Id } from "./_generated/dataModel";

// Single form operations

export const create = mutation({
	args: {
		title: v.string(),
		orgId: v.id("organizations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Unauthorized");
		}
		const userId = identity.subject as Id<"users">;

		const user = await ctx.db.get(userId);

		if (!user) {
			throw new Error("User not found");
		}

		const form = await ctx.db.insert("forms", {
			title: args.title,
			userId,
			name: user.name!,
			orgId: args.orgId,
			isPublished: false,
		});

		return form;
	},
});

export const remove = mutation({
	args: { id: v.id("forms") },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Unauthorized");
		}

		const relatedQuestions = await ctx.db
			.query("questions")
			.withIndex("by_form", (query) => query.eq("formId", args.id))
			.collect();

		for (const question of relatedQuestions) {
			await ctx.db.delete(question._id);
		}

		await ctx.db.delete(args.id);
	},
});

export const update = mutation({
	args: { id: v.id("forms"), title: v.string() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Unauthorized");
		}

		const title = args.title.trim();

		if (!title) {
			throw new Error("Title is required");
		}

		if (title.length > 60) {
			throw new Error("Title cannot be longer than 60 characters");
		}

		const form = await ctx.db.patch(args.id, {
			title: args.title,
		});

		return form;
	},
});

export const get = query({
	args: { id: v.id("forms") },
	handler: async (ctx, args) => {
		const form = await ctx.db.get(args.id);

		if (!form) {
			return null;
		}

		if (form.isPublished) {
			return form;
		}

		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			return null;
		}

		return form;
	},
});

export const publish = mutation({
	args: { id: v.id("forms"), isPublished: v.boolean() },
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Unauthorized");
		}

		const form = await ctx.db.patch(args.id, {
			isPublished: args.isPublished,
		});

		return form;
	},
});

// Multiple form operations

export const getAll = query({
	args: {
		orgId: v.id("organizations"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Unauthorized");
		}

		const forms = await ctx.db
			.query("forms")
			.withIndex("by_org", (query) => query.eq("orgId", args.orgId))
			.order("desc")
			.collect();

		return forms;
	},
});

export const search = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();

		if (!identity) {
			throw new Error("Unauthorized");
		}

		const userId = identity.subject as Id<"users">;

		const forms = await ctx.db
			.query("forms")
			.withIndex("by_user", (query) => query.eq("userId", userId))
			.order("desc")
			.collect();

		return forms;
	},
});
