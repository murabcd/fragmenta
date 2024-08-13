import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

import { alphabet, generateRandomString } from "oslo/crypto";

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

    const org = await ctx.db.get(orgId);

    if (!org) throw new Error("Organization not found");

    const token = generateRandomString(32, alphabet("a-z", "A-Z", "0-9"));

    const invitation = await ctx.db.insert("invitations", {
      email,
      orgId,
      role,
      status: "pending",
      token,
    });

    await ctx.scheduler.runAfter(0, internal.email.invites.sendEmail, {
      email,
      orgId,
      role,
      token,
      name: org.name,
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

export const token = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { token } = args;

    return await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
  },
});

export const status = mutation({
  args: {
    id: v.id("invitations"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, status } = args;

    await ctx.db.patch(id, { status });
  },
});

export const remove = mutation({
  args: { id: v.id("invitations") },
  handler: async (ctx, args) => {
    const { id } = args;
    await ctx.db.delete(id);
  },
});
