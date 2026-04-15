import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { motion } from "motion/react";
import { BarChart3, LogIn } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton.tsx";
import { SignInButton } from "../../components/ui/signin.tsx";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "../../components/ui/empty.tsx";
import { Button } from "../../components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import StatsOverview from "./_components/StatsOverview.tsx";
import CategoryBreakdown from "./_components/CategoryBreakdown.tsx";
import RecentAttempts from "./_components/RecentAttempts.tsx";

function ProgressContent() {
  const attempts = useQuery(api.quizAttempts.getByUser, {});
  const navigate = useNavigate();

  if (attempts === undefined) {
    return (
      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="pt-16">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarChart3 />
            </EmptyMedia>
            <EmptyTitle>No quizzes yet</EmptyTitle>
            <EmptyDescription>
              Take your first quiz to start tracking your progress
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm" onClick={() => navigate("/")}>
              Start a Quiz
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      <StatsOverview attempts={attempts} />
      <CategoryBreakdown attempts={attempts} />
      <RecentAttempts attempts={attempts} />
    </div>
  );
}

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-10 pb-2 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your quiz performance over time
          </p>
        </motion.div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        <AuthLoading>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </AuthLoading>

        <Unauthenticated>
          <div className="pt-16">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LogIn />
                </EmptyMedia>
                <EmptyTitle>Sign in to view progress</EmptyTitle>
                <EmptyDescription>
                  Your quiz scores are saved when you are signed in
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <SignInButton />
              </EmptyContent>
            </Empty>
          </div>
        </Unauthenticated>

        <Authenticated>
          <ProgressContent />
        </Authenticated>
      </div>
    </div>
  );
}
