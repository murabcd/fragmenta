import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    position: v.number(),
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
      .first();

    const newPosition = questions ? questions.position + 1 : 0;

    const question = await ctx.db.insert("questions", {
      title: args.title,
      description: args.description,
      type: args.type,
      position: newPosition,
      formId: args.formId,
    });

    return question;
  },
});

export const remove = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

export const duplicate = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const question = await ctx.db.get(args.id);
    if (!question) {
      throw new Error("Question not found");
    }

    const duplicate = await ctx.db.insert("questions", {
      title: `${question.title} (copy)`,
      description: question.description,
      type: question.type,
      position: question.position,
      formId: question.formId,
    });

    return duplicate;
  },
});

export const update = mutation({
  args: {
    id: v.id("questions"),
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const question = await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description,
      type: args.type,
      position: args.position,
    });

    return question;
  },
});

export const position = mutation({
  args: {
    id: v.id("questions"),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const question = await ctx.db.patch(args.id, {
      position: args.position,
    });

    return question;
  },
});
