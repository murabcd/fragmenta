import { v } from "convex/values";

import { query } from "./_generated/server";

export const get = query({
  args: {
    formId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_form", (query) => query.eq("formId", args.formId))
      .order("desc")
      .collect();

    return questions;
  },
});
