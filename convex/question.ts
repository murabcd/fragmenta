import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.string(),
    choices: v.array(v.string()),
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
      choices: args.choices,
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
      choices: question.choices,
      position: question.position,
      formId: question.formId,
    });

    return duplicate;
  },
});

export const title = mutation({
  args: {
    id: v.id("questions"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const question = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return question;
  },
});

export const description = mutation({
  args: {
    id: v.id("questions"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const question = await ctx.db.patch(args.id, {
      description: args.description,
    });

    return question;
  },
});

export const position = mutation({
  args: {
    id: v.id("questions"),
    formId: v.string(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, formId, position } = args;

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_form", (q) => q.eq("formId", formId))
      .order("asc")
      .collect();

    const index = questions.findIndex((q) => q._id === id);

    const [question] = questions.splice(index, 1);

    questions.splice(position, 0, question);

    const destination = questions.map((question, index) =>
      ctx.db.patch(question._id, { position: index })
    );

    await Promise.all(destination);

    return questions;
  },
});

export const type = mutation({
  args: {
    id: v.id("questions"),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const question = await ctx.db.patch(args.id, {
      type: args.type,
    });

    return question;
  },
});

export const choices = mutation({
  args: {
    id: v.id("questions"),
    choices: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const question = await ctx.db.patch(args.id, {
      choices: args.choices,
    });

    return question;
  },
});
