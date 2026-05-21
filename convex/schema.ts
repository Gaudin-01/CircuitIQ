import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Spread the default auth tables (this brings in the 'sessions' and 'authAccounts' tables)
  ...authTables,

  // Explicitly define the 'users' table to merge Convex's required fields with your custom fields
  users: defineTable({
    // --- Convex Auth Required Fields ---
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    // phone: v.optional(v.string()),
    // phoneVerificationTime: v.optional(v.number()),
    // isAnonymous: v.optional(v.boolean()),

    // --- CircuitIQ Custom Fields ---
    username: v.optional(v.string()),
    role: v.optional(v.string()),
  })
    .index("by_username", ["username"])
    .index("email", ["email"]), // Helpful for auth lookups

  questions: defineTable({
    text: v.string(),
    options: v.array(v.string()),
    correctOptionIndex: v.number(),
    category: v.string(),
    difficulty: v.string(),
    explanation: v.string(),
  })
    .index("by_category_and_difficulty", ["category", "difficulty"])
    .index("by_difficulty", ["difficulty"]),

  quizAttempts: defineTable({
    userId: v.id("users"),
    category: v.string(),
    difficulty: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    completedAt: v.string(),
  }).index("by_user", ["userId"]),
});
