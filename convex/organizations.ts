import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createOrganization = mutation({
	args: {
		name: v.string(),
		slug: v.string(),
		imageUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) throw new Error("Unauthorized");

		const defaultImageUrl = `https://avatar.vercel.sh/${encodeURIComponent(args.name)}`;

		const orgId = await ctx.db.insert("organizations", {
			name: args.name,
			slug: args.slug,
			ownerId: userId,
			imageUrl: args.imageUrl || defaultImageUrl,
		});

		const user = await ctx.db.get(userId);

		if (!user) throw new Error("User not found");

		await ctx.db.insert("members", {
			userId,
			orgId,
			role: "owner",
			name: user.name || "",
			email: user.email || "",
		});
		return orgId;
	},
});

export const getUserOrganizations = query({
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) return [];

		const userOrgs = await ctx.db
			.query("members")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();

		return Promise.all(
			userOrgs.map(async (userOrg) => {
				const org = await ctx.db.get(userOrg.orgId);
				return { ...org, role: userOrg.role };
			}),
		);
	},
});

export const updateOrganization = mutation({
	args: {
		id: v.id("organizations"),
		name: v.string(),
		slug: v.string(),
		imageUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) throw new Error("Unauthorized");

		const org = await ctx.db.get(args.id);

		if (!org) throw new Error("Organization not found");

		const member = await ctx.db
			.query("members")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.filter((q) => q.eq(q.field("orgId"), args.id))
			.unique();

		if (!member || (member.role !== "owner" && member.role !== "admin")) {
			throw new Error("Only the owner or admin can update the organization");
		}

		await ctx.db.patch(args.id, {
			name: args.name,
			slug: args.slug,
			imageUrl: args.imageUrl,
		});

		return args.id;
	},
});

export const deleteOrganization = mutation({
	args: { id: v.id("organizations") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);

		if (!userId) throw new Error("Unauthorized");

		const org = await ctx.db.get(args.id);

		if (!org) throw new Error("Organization not found");

		const member = await ctx.db
			.query("members")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.filter((q) => q.eq(q.field("orgId"), args.id))
			.unique();

		if (!member || member.role !== "owner") {
			throw new Error("Only the owner can delete the organization");
		}

		await ctx.db
			.query("members")
			.withIndex("by_org", (q) => q.eq("orgId", args.id))
			.collect()
			.then((members) => {
				members.forEach((member) => ctx.db.delete(member._id));
			});

		await ctx.db
			.query("forms")
			.withIndex("by_org", (q) => q.eq("orgId", args.id))
			.collect()
			.then((forms) => {
				forms.forEach((form) => ctx.db.delete(form._id));
			});

		await ctx.db.delete(args.id);

		return args.id;
	},
});
