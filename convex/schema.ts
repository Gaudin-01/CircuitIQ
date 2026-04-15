import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

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
