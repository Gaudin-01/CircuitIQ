import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const submit = mutation({
  args: {
    category: v.string(),
    difficulty: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Securely grab the native Convex user ID
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError({
        message: "Must be logged in to save progress",
        code: "UNAUTHENTICATED",
      });
    }

    // 2. We no longer need to search the database for the user!
    // We can insert the attempt directly using the userId we just received.
    return await ctx.db.insert("quizAttempts", {
      userId: userId,
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
    // 1. Securely grab the native Convex user ID
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    // 2. Query attempts directly using the userId
    return await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);
  },
});
