import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import { motion } from "motion/react";
import { Award, Medal, Crown, Trophy } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton.tsx";
import { useAuth } from "../../hooks/use-auth.ts";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "../../components/ui/empty.tsx";
import { cn } from "../../lib/utils.ts";

function getPositionDisplay(index: number) {
  if (index === 0)
    return {
      icon: Crown,
      bg: "bg-gradient-to-br from-amber-400 to-yellow-500",
      text: "text-amber-500",
      ring: "ring-2 ring-amber-400/30",
    };
  if (index === 1)
    return {
      icon: Medal,
      bg: "bg-gradient-to-br from-slate-300 to-slate-400",
      text: "text-slate-400",
      ring: "ring-2 ring-slate-300/30",
    };
  if (index === 2)
    return {
      icon: Award,
      bg: "bg-gradient-to-br from-amber-600 to-amber-700",
      text: "text-amber-600",
      ring: "ring-2 ring-amber-600/30",
    };
  return { icon: null, bg: "", text: "text-muted-foreground", ring: "" };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function LeaderboardPage() {
  const leaderboard = useQuery(api.leaderboard.getLeaderboard, {});
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-10 pb-2 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Top players ranked by average score
          </p>
        </motion.div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {/* Loading */}
        {leaderboard === undefined && (
          <div className="space-y-3 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-18 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {leaderboard !== undefined && leaderboard.length === 0 && (
          <div className="pt-16">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Trophy />
                </EmptyMedia>
                <EmptyTitle>No scores yet</EmptyTitle>
                <EmptyDescription>
                  Be the first to complete a quiz and claim the top spot
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}

        {/* Podium for top 3 */}
        {leaderboard && leaderboard.length > 0 && (
          <div className="space-y-6 pt-4">
            {/* Top 3 podium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: "easeOut" as const,
              }}
              className="flex items-end justify-center gap-3 pt-4 pb-2"
            >
              {/* 2nd place */}
              {leaderboard.length > 1 && (
                <PodiumCard
                  entry={leaderboard[1]}
                  position={2}
                  // We use user._id to check against the Convex database ID
                  isCurrentUser={user?._id === leaderboard[1].userId}
                  height="h-28"
                  delay={0.3}
                />
              )}
              {/* 1st place */}
              <PodiumCard
                entry={leaderboard[0]}
                position={1}
                isCurrentUser={user?._id === leaderboard[0].userId}
                height="h-36"
                delay={0.2}
              />
              {/* 3rd place */}
              {leaderboard.length > 2 && (
                <PodiumCard
                  entry={leaderboard[2]}
                  position={3}
                  isCurrentUser={user?._id === leaderboard[2].userId}
                  height="h-24"
                  delay={0.4}
                />
              )}
            </motion.div>

            {/* Remaining entries */}
            {leaderboard.length > 3 && (
              <div className="space-y-2">
                {leaderboard.slice(3).map((entry, index) => (
                  <LeaderboardRow
                    key={entry.userId}
                    entry={entry}
                    rank={index + 4}
                    isCurrentUser={user?._id === entry.userId}
                    delay={0.4 + index * 0.05}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Added userId to the type to prevent TypeScript warnings
type PodiumEntry = {
  userId: string;
  name: string;
  avgPercentage: number;
  quizzesTaken: number;
  bestPercentage: number;
};

function PodiumCard({
  entry,
  position,
  isCurrentUser,
  height,
  delay,
}: {
  entry: PodiumEntry;
  position: number;
  isCurrentUser: boolean;
  height: string;
  delay: number;
}) {
  const display = getPositionDisplay(position - 1);
  const Icon = display.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" as const }}
      className="flex flex-col items-center"
    >
      {/* Avatar */}
      <div className="relative mb-2">
        <div
          className={cn(
            "size-14 rounded-full flex items-center justify-center text-sm font-bold",
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
            display.ring,
          )}
        >
          {getInitials(entry.name)}
        </div>
        {Icon && (
          <div
            className={cn(
              "absolute -top-1.5 -right-1.5 size-6 rounded-full flex items-center justify-center",
              display.bg,
            )}
          >
            <Icon className="size-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-xs font-semibold truncate max-w-[90px] text-center">
        {entry.name}
      </p>

      {/* Score pedestal */}
      <div
        className={cn(
          "w-24 mt-2 rounded-t-xl flex flex-col items-center justify-end p-3",
          position === 1 && "bg-amber-500/10",
          position === 2 && "bg-slate-400/10",
          position === 3 && "bg-amber-600/10",
          height,
        )}
      >
        <span className={cn("text-2xl font-black", display.text)}>
          {position}
        </span>
        <span className="text-sm font-bold mt-0.5">{entry.avgPercentage}%</span>
        <span className="text-[10px] text-muted-foreground">
          {entry.quizzesTaken} {entry.quizzesTaken === 1 ? "quiz" : "quizzes"}
        </span>
      </div>
    </motion.div>
  );
}

function LeaderboardRow({
  entry,
  rank,
  isCurrentUser,
  delay,
}: {
  entry: PodiumEntry;
  rank: number;
  isCurrentUser: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3, ease: "easeOut" as const }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border",
        isCurrentUser ? "bg-primary/5 border-primary/20" : "bg-card",
      )}
    >
      {/* Rank */}
      <span className="text-sm font-bold text-muted-foreground w-6 text-center shrink-0">
        {rank}
      </span>

      {/* Avatar */}
      <div
        className={cn(
          "size-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
        )}
      >
        {getInitials(entry.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">
          {entry.name}
          {isCurrentUser && (
            <span className="text-xs font-normal text-primary ml-1.5">
              (You)
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground">
          {entry.quizzesTaken} {entry.quizzesTaken === 1 ? "quiz" : "quizzes"}{" "}
          &middot; Best: {entry.bestPercentage}%
        </p>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className="text-lg font-bold">{entry.avgPercentage}%</p>
        <p className="text-[10px] text-muted-foreground">avg</p>
      </div>
    </motion.div>
  );
}
