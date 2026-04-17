import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(), // Unique identifier from Clerk
    // tokenIdentifier: v.optional(v.string()), // Deprecated, but keep for backward compatibility
    name: v.optional(v.string()), // Google Display Name
    email: v.optional(v.string()),
    role: v.optional(v.string()),
    picture: v.optional(v.string()),
    username: v.optional(v.string()), // This is the unique one
  })
    .index("by_username", ["username"]) // Crucial for checking availability
    .index("by_clerkId", ["clerkId"]),

  // });
  // export default defineSchema({
  //   users: defineTable({
  //     tokenIdentifier: v.string(),
  //     name: v.optional(v.string()),
  //     email: v.optional(v.string()),
  //     role: v.optional(v.string()),
  //   }).index("by_token", ["tokenIdentifier"]),

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
