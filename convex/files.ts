import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});

export const updateWorkspaceImage = mutation({
	args: { orgId: v.id("workspaces"), imageUrl: v.string() },
	handler: async (ctx, { orgId, imageUrl }) => {
		await ctx.db.patch(orgId, { imageUrl });
	},
});

export const getStorageUrl = mutation({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, { storageId }) => {
		return await ctx.storage.getUrl(storageId);
	},
});
