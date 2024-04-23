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

export const search = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const authorId = identity.subject;

    const forms = await ctx.db
      .query("forms")
      .withIndex("by_author", (query) => query.eq("authorId", authorId))
      .order("desc")
      .collect();

    return forms;
  },
});
