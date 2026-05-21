import { query, mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server"; // Added 'type' here
import { ConvexError, v } from "convex/values";

const questionFields = {
  text: v.string(),
  options: v.array(v.string()),
  correctOptionIndex: v.number(),
  category: v.string(),
  difficulty: v.string(),
  explanation: v.string(),
};

const checkAdmin = async (ctx: MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.role !== "admin") {
    throw new ConvexError({
      message: "Unauthorized: Admin access required.",
      code: "UNAUTHORIZED",
    });
  }
  return identity;
};

export const getByFilter = query({
  args: {
    category: v.optional(v.string()),
    difficulty: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category && args.difficulty) {
      return await ctx.db
        .query("questions")
        .withIndex("by_category_and_difficulty", (q) =>
          q.eq("category", args.category!).eq("difficulty", args.difficulty!),
        )
        .collect();
    }
    if (args.category) {
      return await ctx.db
        .query("questions")
        .withIndex("by_category_and_difficulty", (q) =>
          q.eq("category", args.category!),
        )
        .collect();
    }
    if (args.difficulty) {
      return await ctx.db
        .query("questions")
        .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty!))
        .collect();
    }
    return await ctx.db.query("questions").collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("questions").order("desc").collect();
  },
});

// Helper: Cleans text for a fair comparison
const normalize = (str: string) => 
  str.toLowerCase().replace(/[^\w\s]/g, "").trim();

const checkSimilarity = (newText: string, existingQuestions: { text: string }[]) => {
  const normNew = normalize(newText);
  
  for (const q of existingQuestions) {
    const normExisting = normalize(q.text);
    
    // 1. Check for exact matches after normalization
    if (normNew === normExisting) return q.text;

    // 2. Check for "contains" (one is a subset of the other)
    if (normNew.includes(normExisting) || normExisting.includes(normNew)) {
       // Only trigger if they are long enough to be meaningful
       if (normNew.length > 20) return q.text;
    }
  }
  return null;
};
export const create = mutation({
  args: questionFields,
  handler: async (ctx, args) => {
    await checkAdmin(ctx);

    const existing = await ctx.db.query("questions").collect();

    // 2. Run the check
    const similarQuestion = checkSimilarity(args.text, existing);

    if (similarQuestion) {
      throw new ConvexError({
        message: `Duplicate detected: This is too similar to: "${similarQuestion}"`,
        code: "DUPLICATE_ERROR",
      });
    }

    return await ctx.db.insert("questions", args);
  },
});

export const bulkCreate = mutation({
  args: { questions: v.array(v.object(questionFields)) },
  handler: async (ctx, args) => {
    await checkAdmin(ctx); //use helper function to check admin access

    const ids: string[] = [];
    for (const q of args.questions) {
      if (q.options.length < 2) continue;
      if (q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length)
        continue;
      const id = await ctx.db.insert("questions", q);
      ids.push(id);
    }
    return { inserted: ids.length, total: args.questions.length };
  },
});

export const update = mutation({
  args: { id: v.id("questions"), ...questionFields },
  handler: async (ctx, args) => {
    await checkAdmin(ctx); //use helper function to check admin access

    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new ConvexError({
        message: "Question not found",
        code: "NOT_FOUND",
      });
    }
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    await checkAdmin(ctx); //use helper function to check admin access

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new ConvexError({
        message: "Question not found",
        code: "NOT_FOUND",
      });
    }
    await ctx.db.delete(args.id);
  },
});

