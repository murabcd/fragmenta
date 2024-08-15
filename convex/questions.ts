import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

// Single question operations

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.string(),
    choices: v.array(v.string()),
    position: v.number(),
    formId: v.string(),
    isRequired: v.boolean(),
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
      isRequired: args.isRequired,
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
      isRequired: question.isRequired,
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

export const response = mutation({
  args: {
    questionId: v.id("questions"),
    formId: v.id("forms"),
    response: v.union(v.string(), v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { questionId, formId, response } = args;

    const existingResponse = await ctx.db
      .query("responses")
      .withIndex("by_question", (q) => q.eq("questionId", questionId))
      .filter((q) => q.eq(q.field("formId"), formId))
      .first();

    if (existingResponse) {
      return await ctx.db.patch(existingResponse._id, { response });
    } else {
      return await ctx.db.insert("responses", {
        questionId,
        formId,
        response,
      });
    }
  },
});

export const required = mutation({
  args: {
    id: v.id("questions"),
    isRequired: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const question = await ctx.db.patch(args.id, {
      isRequired: args.isRequired,
    });

    return question;
  },
});

// Multiple question operations

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
      await ctx.db.insert("questions", {
        ...question,
        isRequired: false,
      });
    }

    return generated;
  },
});
