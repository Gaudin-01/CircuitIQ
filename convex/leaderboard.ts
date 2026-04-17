import { query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel.d.ts";

type LeaderboardEntry = {
  userId: Id<"users">;
  name: string;
  quizzesTaken: number;
  totalCorrect: number;
  totalQuestions: number;
  avgPercentage: number;
  bestPercentage: number;
};

export const getLeaderboard = query({
  args: {},
  handler: async (ctx): Promise<LeaderboardEntry[]> => {
    // 1. Fetch all quiz attempts (limited to last 1000 for performance)
    const allAttempts = await ctx.db
      .query("quizAttempts")
      .order("desc")
      .take(1000);

    // 2. Group attempts by userId
    const userAttempts = new Map<Id<"users">, Doc<"quizAttempts">[]>();

    for (const attempt of allAttempts) {
      const existing = userAttempts.get(attempt.userId) ?? [];
      existing.push(attempt);
      userAttempts.set(attempt.userId, existing);
    }

    // 3. Build leaderboard entries
    const entries: LeaderboardEntry[] = [];

    for (const [userId, attempts] of userAttempts) {
      const user = await ctx.db.get(userId);

      // Skip attempts from users that no longer exist or aren't loaded yet
      if (!user) continue;

      const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
      const totalQuestions = attempts.reduce(
        (sum, a) => sum + a.totalQuestions,
        0,
      );

      const avgPercentage =
        totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : 0;

      let bestPercentage = 0;
      for (const a of attempts) {
        if (a.totalQuestions > 0) {
          const pct = Math.round((a.score / a.totalQuestions) * 100);
          if (pct > bestPercentage) bestPercentage = pct;
        }
      }

      const finalDisplayName =
        user.username ||
        (user.name && user.name !== "unset" ? user.name : "Anonymous");
      entries.push({
        userId,
        // Using the logic to handle 'unset' or missing names
        name: finalDisplayName,
        quizzesTaken: attempts.length,
        totalCorrect,
        totalQuestions,
        avgPercentage,
        bestPercentage,
      });
    }

    // 4. Sort by avg percentage desc, then by quizzes taken desc
    entries.sort((a, b) => {
      if (b.avgPercentage !== a.avgPercentage) {
        return b.avgPercentage - a.avgPercentage;
      }
      return b.quizzesTaken - a.quizzesTaken;
    });

    return entries.slice(0, 50);
  },
});