import { motion } from "motion/react";
import { Trophy, Target, Flame, Clock } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel.d.ts";

type StatsOverviewProps = {
  attempts: Doc<"quizAttempts">[];
};

type StatCardData = {
  label: string;
  value: string;
  icon: typeof Trophy;
  gradient: string;
};

export default function StatsOverview({ attempts }: StatsOverviewProps) {
  const totalQuizzes = attempts.length;
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
  const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
  const avgScore =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Calculate streak: consecutive quizzes with >= 70% score (most recent first)
  let streak = 0;
  for (const attempt of attempts) {
    if (attempt.totalQuestions > 0) {
      const pct = (attempt.score / attempt.totalQuestions) * 100;
      if (pct >= 70) {
        streak++;
      } else {
        break;
      }
    }
  }

  const stats: StatCardData[] = [
    {
      label: "Quizzes Taken",
      value: totalQuizzes.toString(),
      icon: Trophy,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Avg. Score",
      value: `${avgScore}%`,
      icon: Target,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      label: "Hot Streak",
      value: streak.toString(),
      icon: Flame,
      gradient: "from-red-500 to-rose-500",
    },
    {
      label: "Questions Answered",
      value: totalQuestions.toString(),
      icon: Clock,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              duration: 0.4,
              ease: "easeOut" as const,
            }}
            className="bg-card rounded-xl p-4 border"
          >
            <div
              className={`inline-flex items-center justify-center size-9 rounded-lg bg-gradient-to-br ${stat.gradient} text-white mb-2.5`}
            >
              <Icon className="size-4" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
