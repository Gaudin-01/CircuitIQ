import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";

export const submit = mutation({
  args: {
    category: v.string(),
    difficulty: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        message: "Must be logged in to save progress",
        code: "UNAUTHENTICATED",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) {
      throw new ConvexError({
        message: "User not found",
        code: "NOT_FOUND",
      });
    }

    return await ctx.db.insert("quizAttempts", {
      userId: user._id,
      category: args.category,
      difficulty: args.difficulty,
      score: args.score,
      totalQuestions: args.totalQuestions,
      completedAt: new Date().toISOString(),
    });
  },
});

export const getByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (!user) return [];

    return await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);
  },
});
