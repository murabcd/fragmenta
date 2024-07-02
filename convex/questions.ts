import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

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
      .order("asc")
      .collect();

    return questions;
  },
});

export const count = query({
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
      .collect();

    return questions.length;
  },
});

export const published = query({
  args: { formId: v.id("forms") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_form", (query) => query.eq("formId", args.formId))
      .order("asc")
      .collect();

    return questions;
  },
});

export const generate = mutation({
  args: {
    questions: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
        type: v.string(),
      })
    ),
    formId: v.string(),
  },
  handler: async (ctx, args) => {
    const generated = args.questions.map((question, index) => ({
      ...question,
      formId: args.formId,
      position: index,
      choices: [],
    }));

    for (const question of generated) {
      await ctx.db.insert("questions", question);
    }

    return generated;
  },
});
