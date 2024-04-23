import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const form = await ctx.db.insert("forms", {
      title: args.title,
      authorId: identity.subject,
      authorName: identity.name!,
      orgId: args.orgId,
      isPublished: false,
    });

    return form;
  },
});
