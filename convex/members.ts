import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getMembersByWorkspace = query({
	args: { wsId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const { wsId } = args;

		return await ctx.db
			.query("members")
			.withIndex("by_ws", (q) => q.eq("wsId", wsId))
			.collect();
	},
});

export const addMember = mutation({
	args: {
		userId: v.id("users"),
		wsId: v.id("workspaces"),
		role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
		name: v.string(),
		email: v.string(),
	},
	handler: async (ctx, args) => {
		const { userId, wsId, role, name, email } = args;

		return await ctx.db.insert("members", {
			userId,
			wsId,
			role,
			name,
			email,
		});
	},
});

export const removeMember = mutation({
	args: { id: v.id("members") },
	handler: async (ctx, args) => {
		const { id } = args;
		await ctx.db.delete(id);
	},
});
