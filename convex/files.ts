import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
});

export const updateWorkspaceImage = mutation({
	args: { wsId: v.id("workspaces"), imageUrl: v.string() },
	handler: async (ctx, { wsId, imageUrl }) => {
		await ctx.db.patch(wsId, { imageUrl });
	},
});

export const getStorageUrl = mutation({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, { storageId }) => {
		return await ctx.storage.getUrl(storageId);
	},
});

export const getQuestionImageUrl = query({
	args: { storageId: v.id("_storage") },
	returns: v.union(v.string(), v.null()),
	handler: async (ctx, { storageId }) => {
		return await ctx.storage.getUrl(storageId);
	},
});
