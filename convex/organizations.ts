import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject as Id<"users">;

    const defaultImageUrl = `https://avatar.vercel.sh/${encodeURIComponent(args.name)}`;

    const orgId = await ctx.db.insert("organizations", {
      name: args.name,
      slug: args.slug,
      ownerId: userId,
      imageUrl: args.imageUrl || defaultImageUrl,
    });

    await ctx.db.insert("members", { userId, orgId, role: "owner" });
    return orgId;
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) return [];

    const userId = identity.subject as Id<"users">;

    const userOrgs = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return Promise.all(
      userOrgs.map(async (userOrg) => {
        const org = await ctx.db.get(userOrg.orgId);
        return { ...org, role: userOrg.role };
      })
    );
  },
});
