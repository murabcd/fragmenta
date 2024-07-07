import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const send = mutation({
  args: {
    email: v.string(),
    orgId: v.id("organizations"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const { email, orgId, role } = args;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", email))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .first();

    if (existingInvitation) {
      throw new Error("Invitation already exists");
    }

    const invitation = await ctx.db.insert("invitations", {
      email,
      orgId,
      role,
      status: "pending",
    });

    await ctx.scheduler.runAfter(0, internal.invites.sendEmail, {
      email,
      orgId,
      role,
    });

    return invitation;
  },
});

export const get = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    const { orgId } = args;

    return await ctx.db
      .query("invitations")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();
  },
});
