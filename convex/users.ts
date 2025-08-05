import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getCurrentUser = query({
	args: {},
	handler: async (ctx): Promise<Doc<"users"> | null> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			return null;
		}
		return await ctx.db.get(userId);
	},
});

export const getUserById = query({
	args: { id: v.id("users") },
	handler: async (ctx, args): Promise<Doc<"users"> | null> => {
		return await ctx.db.get(args.id);
	},
});

export const getUserByEmail = query({
	args: { email: v.string() },
	handler: async (ctx, args): Promise<Doc<"users"> | null> => {
		return await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("email"), args.email))
			.first();
	},
});

export const deleteCurrentUser = mutation({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("User not authenticated");
		}

		await ctx.db.delete(userId);

		return { success: true };
	},
});

export const updateCurrentUserProfile = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		avatarStorageId: v.optional(v.id("_storage")),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("User not authenticated");
		}

		let avatarUrlToStore: string | undefined;

		if (args.avatarStorageId) {
			const urlFromResult = await ctx.storage.getUrl(args.avatarStorageId);
			if (urlFromResult) {
				avatarUrlToStore = urlFromResult;
			} else {
				console.warn(
					`Could not get URL for storageId: ${args.avatarStorageId}. Avatar URL will not be updated.`,
				);
				avatarUrlToStore = undefined;
			}
		}

		await ctx.db.patch(userId, {
			name: args.name,
			email: args.email,
			...(args.avatarStorageId !== undefined && {
				avatarStorageId: args.avatarStorageId,
			}),
			image: args.avatarStorageId ? avatarUrlToStore : undefined,
		});

		return { success: true };
	},
});

export const updateUserAvatar = mutation({
	args: { userId: v.id("users"), imageUrl: v.string() },
	handler: async (ctx, args) => {
		const { userId, imageUrl } = args;
		await ctx.db.patch(userId, { image: imageUrl });
	},
});

export const updateUserProfile = mutation({
	args: {
		id: v.id("users"),
		name: v.optional(v.string()),
		email: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { id, ...updates } = args;
		await ctx.db.patch(id, updates);
	},
});

export const deleteUserById = mutation({
	args: { id: v.id("users") },
	handler: async (ctx, args): Promise<void> => {
		await ctx.db.delete(args.id);
	},
});
