import { v } from "convex/values";

import { query } from "./_generated/server";

export const get = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const forms = await ctx.db
      .query("forms")
      .withIndex("by_org", (query) => query.eq("orgId", args.orgId))
      .order("desc")
      .collect();

    return forms;
  },
});
