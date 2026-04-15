import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button.tsx";
import { Skeleton } from "../../components/ui/skeleton.tsx";
import QuestionCard from "./_components/QuestionCard.tsx";
import ResultsView from "./_components/ResultsView.tsx";
import { shuffleArray } from "./_lib/utils.ts";
import { TIME_PER_QUESTION } from "../../lib/quiz-constants.ts";
import { cn } from "../../lib/utils.ts";
import type { Doc } from "../../../convex/_generated/dataModel.d.ts";

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser);

  const category = searchParams.get("category") || undefined;
  const difficulty = searchParams.get("difficulty") || undefined;
  const count = parseInt(searchParams.get("count") || "10");

  // Fetch all matching questions
  const allQuestions = useQuery(api.questions.getByFilter, {
    category,
    difficulty,
  });

  const submitAttempt = useMutation(api.quizAttempts.submit);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<Doc<"questions">[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const hasInitialized = useRef(false);
  const hasSubmitted = useRef(false);
  const hasHandledTimeOut = useRef(false);

  // Initialize quiz questions once when data loads
  useEffect(() => {
    if (allQuestions && allQuestions.length > 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      const shuffled = shuffleArray(allQuestions);
      const selectedQuestions = shuffled.slice(
        0,
        Math.min(count, shuffled.length),
      );
      // Use a microtask to defer state update
      queueMicrotask(() => {
        setQuizQuestions(selectedQuestions);
      });
    }
  }, [allQuestions, count]);

  // Timer countdown
  useEffect(() => {
    if (quizQuestions.length === 0 || showFeedback || isComplete) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [quizQuestions.length, showFeedback, isComplete, currentIndex]);

  // Handle time running out
  useEffect(() => {
    if (
      timeLeft === 0 &&
      !showFeedback &&
      !isComplete &&
      quizQuestions.length > 0 &&
      !hasHandledTimeOut.current
    ) {
      hasHandledTimeOut.current = true;
      queueMicrotask(() => {
        setShowFeedback(true);
      });
    }
  }, [timeLeft, showFeedback, isComplete, quizQuestions, currentIndex]);

  // Reset timeout flag when feedback is shown or question changes
  useEffect(() => {
    hasHandledTimeOut.current = false;
  }, [showFeedback, currentIndex]);

  // Auto-advance after showing feedback
  useEffect(() => {
    if (!showFeedback) return;
    const timeout = setTimeout(() => {
      if (currentIndex >= quizQuestions.length - 1) {
        setIsComplete(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setTimeLeft(TIME_PER_QUESTION);
      }
    }, 1800);
    return () => clearTimeout(timeout);
  }, [showFeedback, currentIndex, quizQuestions.length]);

  // Save attempt when quiz completes (only for authenticated users)
  useEffect(() => {
    if (
      isComplete &&
      user &&
      !hasSubmitted.current &&
      quizQuestions.length > 0
    ) {
      hasSubmitted.current = true;
      submitAttempt({
        category: category || "all",
        difficulty: difficulty || "all",
        score,
        totalQuestions: quizQuestions.length,
      }).catch(() => {
        // Silently fail — user may have logged out
      });
    }
  }, [
    isComplete,
    user,
    score,
    quizQuestions.length,
    category,
    difficulty,
    submitAttempt,
  ]);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (showFeedback || isComplete) return;
      const question = quizQuestions[currentIndex];
      const correct = optionIndex === question.correctOptionIndex;
      setSelectedOption(optionIndex);
      setShowFeedback(true);
      if (correct) setScore((prev) => prev + 1);
    },
    [showFeedback, isComplete, quizQuestions, currentIndex],
  );

  const handleRetry = () => {
    // 1. Reset the locks
    hasInitialized.current = false;
    hasSubmitted.current = false;

    // 2. Clear current questions so the "Loading" state triggers briefly
    setQuizQuestions([]);

    // 3. Reset all gameplay state
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setIsComplete(false);
    setTimeLeft(TIME_PER_QUESTION);

    // 4. Manually trigger the shuffle logic if allQuestions is already there
    if (allQuestions && allQuestions.length > 0) {
      const shuffled = shuffleArray(allQuestions);
      setQuizQuestions(shuffled.slice(0, Math.min(count, shuffled.length)));
      hasInitialized.current = true;
    }
  };

  // Loading
  if (allQuestions === undefined) {
    return (
      <div className="min-h-screen bg-background p-4 pt-6 space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // No questions
  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-lg font-bold">No questions available</p>
          <p className="text-sm text-muted-foreground">
            Try selecting a different category or difficulty
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Still initializing from fetched data
  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 pt-6 space-y-6">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  // Quiz complete — show results
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <ResultsView
          score={score}
          totalQuestions={quizQuestions.length}
          category={category || "All Topics"}
          difficulty={difficulty || "all"}
          onRetry={handleRetry}
          onHome={() => navigate("/")}
          isAuthenticated={!!user}
        />
      </div>
    );
  }

  // Active quiz
  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;
  // const progress = (currentIndex / quizQuestions.length) * 100;
  const circumference = 2 * Math.PI * 18;
  const timerOffset = circumference * (1 - timeLeft / TIME_PER_QUESTION);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-center">
          <p className="text-sm font-bold">
            {currentIndex + 1}{" "}
            <span className="text-muted-foreground font-normal">
              of {quizQuestions.length}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">Score: {score}</p>
        </div>
        {/* Circular timer */}
        <div className="relative size-11">
          <svg className="size-11 -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-muted"
            />
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="currentColor"
              className={cn(
                "transition-[stroke-dashoffset] duration-1000 ease-linear",
                timeLeft <= 5 ? "text-destructive" : "text-primary",
              )}
              strokeDasharray={circumference}
              strokeDashoffset={timerOffset}
            />
          </svg>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center text-xs font-bold",
              timeLeft <= 5 && "text-destructive",
            )}
          >
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-5">
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" as const }}
          />
        </div>
      </div>

      {/* Question content with transitions */}
      <div className="flex-1 px-4 pb-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
          >
            <QuestionCard
              question={currentQuestion}
              selectedOption={selectedOption}
              showFeedback={showFeedback}
              onSelectOption={handleSelectOption}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
