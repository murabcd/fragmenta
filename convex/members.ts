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
