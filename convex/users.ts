import { v } from "convex/values";

import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

import bcrypt from "bcryptjs";

export const create = action({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    emailVerified: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const existingUser = await ctx.runQuery(api.users.email, {
      email: args.email,
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(args.password, 10);

    const userId = await ctx.runMutation(api.users.insert, {
      email: args.email,
      name: args.name,
      password: hashedPassword,
      role: args.role,
      emailVerified: args.emailVerified,
    });

    return await ctx.runQuery(api.users.get, { id: userId });
  },
});

export const verify = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const user = await ctx.runQuery(api.users.email, { email: args.email });

    if (!user || !user.password) {
      return false;
    }

    return await bcrypt.compare(args.password, user.password);
  },
});

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    return await ctx.db.get(args.id);
  },
});

export const insert = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    emailVerified: v.optional(v.number()),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args): Promise<Id<"users">> => {
    return await ctx.db.insert("users", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<void> => {
    const updates: Partial<typeof args> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.email !== undefined) updates.email = args.email;
    if (args.password !== undefined) {
      updates.password = await bcrypt.hash(args.password, 10);
    }
    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args): Promise<void> => {
    await ctx.db.delete(args.id);
  },
});

export const email = query({
  args: { email: v.string() },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});
