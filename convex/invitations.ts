import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

import { alphabet, generateRandomString } from "oslo/crypto";

export const sendInvitation = mutation({
	args: {
		email: v.string(),
		wsId: v.id("workspaces"),
		role: v.union(v.literal("admin"), v.literal("member")),
	},
	handler: async (ctx, args) => {
		const { email, wsId, role } = args;

		const userId = await getAuthUserId(ctx);
		if (!userId) throw new Error("Unauthorized");

		const existingInvitation = await ctx.db
			.query("invitations")
			.withIndex("by_email", (q) => q.eq("email", email))
			.filter((q) => q.eq(q.field("wsId"), wsId))
			.first();

		if (existingInvitation) {
			throw new Error("Invitation already exists");
		}

		const org = await ctx.db.get(wsId);

		if (!org) throw new Error("Workspace not found");

		const token = generateRandomString(32, alphabet("a-z", "A-Z", "0-9"));

		const invitation = await ctx.db.insert("invitations", {
			email,
			wsId,
			role,
			status: "pending",
			token,
		});

		await ctx.scheduler.runAfter(0, internal.email.invites.sendEmail, {
			email,
			wsId,
			role,
			token,
			name: org.name,
		});

		return invitation;
	},
});

export const getInvitationsByWorkspace = query({
	args: { wsId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const { wsId } = args;

		return await ctx.db
			.query("invitations")
			.withIndex("by_ws", (q) => q.eq("wsId", wsId))
			.filter((q) => q.eq(q.field("status"), "pending"))
			.collect();
	},
});

export const getInvitationByToken = query({
	args: { token: v.string() },
	handler: async (ctx, args) => {
		const { token } = args;

		return await ctx.db
			.query("invitations")
			.withIndex("by_token", (q) => q.eq("token", token))
			.first();
	},
});

export const updateInvitationStatus = mutation({
	args: {
		id: v.id("invitations"),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		const { id, status } = args;

		await ctx.db.patch(id, { status });
	},
});

export const deleteInvitation = mutation({
	args: { id: v.id("invitations") },
	handler: async (ctx, args) => {
		const { id } = args;
		await ctx.db.delete(id);
	},
});
