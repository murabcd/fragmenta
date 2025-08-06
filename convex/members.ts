import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getMembersByWorkspace = query({
	args: { orgId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const { orgId } = args;

		return await ctx.db
			.query("members")
			.withIndex("by_org", (q) => q.eq("orgId", orgId))
			.collect();
	},
});

export const addMember = mutation({
	args: {
		userId: v.id("users"),
		orgId: v.id("workspaces"),
		role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
		name: v.string(),
		email: v.string(),
	},
	handler: async (ctx, args) => {
		const { userId, orgId, role, name, email } = args;

		return await ctx.db.insert("members", {
			userId,
			orgId,
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
