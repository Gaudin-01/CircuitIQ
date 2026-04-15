import { motion } from "motion/react";
import { CATEGORIES } from "../../../lib/quiz-constants.ts";
import { cn } from "../../../lib/utils.ts";
import type { Doc } from "../../../../convex/_generated/dataModel.d.ts";

type CategoryBreakdownProps = {
  attempts: Doc<"quizAttempts">[];
};

type CategoryStat = {
  name: string;
  gradient: string;
  quizzes: number;
  correct: number;
  total: number;
  percentage: number;
};

export default function CategoryBreakdown({
  attempts,
}: CategoryBreakdownProps) {
  // Aggregate stats by category
  const categoryMap = new Map<
    string,
    { quizzes: number; correct: number; total: number }
  >();

  for (const attempt of attempts) {
    const cat = attempt.category;
    const existing = categoryMap.get(cat) ?? {
      quizzes: 0,
      correct: 0,
      total: 0,
    };
    existing.quizzes++;
    existing.correct += attempt.score;
    existing.total += attempt.totalQuestions;
    categoryMap.set(cat, existing);
  }

  const stats: CategoryStat[] = [];
  for (const cat of CATEGORIES) {
    if (cat.id === "all") continue;
    const data = categoryMap.get(cat.id);
    if (!data) continue;
    stats.push({
      name: cat.name,
      gradient: cat.gradient,
      quizzes: data.quizzes,
      correct: data.correct,
      total: data.total,
      percentage:
        data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    });
  }

  // Also handle "all" category attempts
  const allData = categoryMap.get("all");
  if (allData) {
    stats.unshift({
      name: "All Topics",
      gradient: "from-violet-500 to-fuchsia-500",
      quizzes: allData.quizzes,
      correct: allData.correct,
      total: allData.total,
      percentage:
        allData.total > 0
          ? Math.round((allData.correct / allData.total) * 100)
          : 0,
    });
  }

  // Sort by quizzes taken (most first)
  stats.sort((a, b) => b.quizzes - a.quizzes);

  if (stats.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        By Category
      </h2>
      <div className="space-y-2.5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.3 + index * 0.06,
              duration: 0.4,
              ease: "easeOut" as const,
            }}
            className="bg-card rounded-xl p-4 border"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "size-2.5 rounded-full bg-gradient-to-br",
                    stat.gradient,
                  )}
                />
                <span className="text-sm font-semibold">{stat.name}</span>
              </div>
              <span className="text-sm font-bold">{stat.percentage}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r",
                  stat.gradient,
                )}
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{
                  delay: 0.5 + index * 0.06,
                  duration: 0.7,
                  ease: "easeOut" as const,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stat.correct}/{stat.total} correct across {stat.quizzes}{" "}
              {stat.quizzes === 1 ? "quiz" : "quizzes"}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
