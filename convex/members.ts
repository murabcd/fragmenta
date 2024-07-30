import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const get = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    const { orgId } = args;

    return await ctx.db
      .query("members")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();
  },
});

export const add = mutation({
  args: {
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const { userId, orgId, role } = args;

    return await ctx.db.insert("members", {
      userId,
      orgId,
      role,
    });
  },
});
