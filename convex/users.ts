import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // This securely grabs the native Convex user ID
    const userId = await getAuthUserId(ctx);

    if (!userId) return null;

    // Fetch the user directly from the database
    return await ctx.db.get(userId);
  },
});

export const setUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Patch the user document with the new username
    await ctx.db.patch(userId, {
      username: args.username.toLowerCase().trim(),
    });
  },
});

export const checkUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    // Search the users table for this username
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username.toLowerCase()))
      .first();

    return !!existing; // returns true if taken, false if free
  },
});

export const initializeRole = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Get the current logged-in user's ID
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    // 2. Fetch their full database record
    const user = await ctx.db.get(userId);

    // 3. ONLY update them if the role is completely missing (undefined)
    if (user && user.role === undefined) {
      await ctx.db.patch(userId, { role: "student" });
    }
  },
});