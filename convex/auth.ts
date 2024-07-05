import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";

import { v } from "convex/values";
import { query } from "./_generated/server";

export async function getViewerId(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return identity.subject as Id<"users">;
}

export const getUser = query({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const questions = await ctx.db
      .query("users")
      .withIndex("email", (query) => query.eq("email", args.email))
      .order("asc")
      .collect();

    return questions;
  },
});
