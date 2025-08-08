import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

export const createForm = mutation({
	args: {
		title: v.string(),
		wsId: v.id("workspaces"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const user = await ctx.db.get(userId);

		if (!user) {
			throw new Error("User not found");
		}

		const form = await ctx.db.insert("forms", {
			title: args.title,
			userId,
			name: user.name || "",
			wsId: args.wsId,
			isPublished: false,
		});

		return form;
	},
});

export const deleteForm = mutation({
	args: { id: v.id("forms") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
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

export const updateFormTitle = mutation({
	args: { id: v.id("forms"), title: v.string() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
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

export const getFormById = query({
	args: { id: v.id("forms") },
	handler: async (ctx, args) => {
		const form = await ctx.db.get(args.id);

		if (!form) {
			return null;
		}

		if (form.isPublished) {
			return form;
		}

		const userId = await getAuthUserId(ctx);

		if (!userId) {
			return null;
		}

		return form;
	},
});

export const updateFormPublishStatus = mutation({
	args: { id: v.id("forms"), isPublished: v.boolean() },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const form = await ctx.db.patch(args.id, {
			isPublished: args.isPublished,
		});

		return form;
	},
});

export const getFormsByWorkspace = query({
	args: {
		wsId: v.id("workspaces"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const forms = await ctx.db
			.query("forms")
			.withIndex("by_ws", (query) => query.eq("wsId", args.wsId))
			.order("desc")
			.collect();

		return forms;
	},
});

export const getUserForms = query({
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const forms = await ctx.db
			.query("forms")
			.withIndex("by_user", (query) => query.eq("userId", userId))
			.order("desc")
			.collect();

		return forms;
	},
});

export const search = query({
	args: {
		searchTerm: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		const forms = await ctx.db
			.query("forms")
			.withIndex("by_user", (query) => query.eq("userId", userId))
			.order("desc")
			.collect();

		if (!args.searchTerm) {
			return forms;
		}

		return forms.filter((form) =>
			form.title.toLowerCase().includes(args.searchTerm!.toLowerCase()),
		);
	},
});

export const getFormResponseStats = query({
	args: {
		wsId: v.id("workspaces"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) {
			throw new Error("Unauthorized");
		}

		// Get all forms for this workspace
		const forms = await ctx.db
			.query("forms")
			.withIndex("by_ws", (query) => query.eq("wsId", args.wsId))
			.collect();

		const responseStats: Record<string, Record<string, number>> = {};

		for (const form of forms) {
			const formResponses = await ctx.db
				.query("responses")
				.withIndex("by_form", (query) => query.eq("formId", form._id))
				.collect();

			const dailyResponses: Record<string, number> = {};
			formResponses.forEach((response) => {
				const date = new Date(response._creationTime)
					.toISOString()
					.split("T")[0];
				dailyResponses[date] = (dailyResponses[date] || 0) + 1;
			});

			responseStats[form._id] = dailyResponses;
		}

		return {
			forms,
			responseStats,
		};
	},
});
