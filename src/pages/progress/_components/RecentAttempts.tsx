import { motion } from "motion/react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils.ts";
import type { Doc } from "../../../../convex/_generated/dataModel.d.ts";

type RecentAttemptsProps = {
  attempts: Doc<"quizAttempts">[];
};

function getScoreColor(percentage: number) {
  if (percentage >= 80) return "text-green-600 dark:text-green-400 bg-green-500/10";
  if (percentage >= 60) return "text-blue-600 dark:text-blue-400 bg-blue-500/10";
  if (percentage >= 40) return "text-amber-600 dark:text-amber-400 bg-amber-500/10";
  return "text-red-600 dark:text-red-400 bg-red-500/10";
}

export default function RecentAttempts({ attempts }: RecentAttemptsProps) {
  const recent = attempts.slice(0, 10);

  if (recent.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Recent Quizzes
      </h2>
      <div className="space-y-2">
        {recent.map((attempt, index) => {
          const percentage =
            attempt.totalQuestions > 0
              ? Math.round((attempt.score / attempt.totalQuestions) * 100)
              : 0;
          const displayCategory =
            attempt.category === "all" ? "All Topics" : attempt.category;

          return (
            <motion.div
              key={attempt._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4 + index * 0.05,
                duration: 0.3,
                ease: "easeOut" as const,
              }}
              className="flex items-center justify-between bg-card rounded-xl px-4 py-3 border"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {displayCategory}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold",
                      attempt.difficulty === "easy" &&
                        "bg-green-500/10 text-green-600 dark:text-green-400",
                      attempt.difficulty === "medium" &&
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      attempt.difficulty === "hard" &&
                        "bg-red-500/10 text-red-600 dark:text-red-400",
                      attempt.difficulty === "all" &&
                        "bg-violet-500/10 text-violet-600 dark:text-violet-400",
                    )}
                  >
                    {attempt.difficulty === "all"
                      ? "Mixed"
                      : attempt.difficulty.charAt(0).toUpperCase() +
                        attempt.difficulty.slice(1)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(attempt.completedAt), "MMM d, h:mm a")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-xs text-muted-foreground">
                  {attempt.score}/{attempt.totalQuestions}
                </span>
                <span
                  className={cn(
                    "text-sm font-bold px-2.5 py-1 rounded-lg",
                    getScoreColor(percentage),
                  )}
                >
                  {percentage}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
