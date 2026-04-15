import { cn } from "../../../lib/utils.ts";
import { Check, X } from "lucide-react";
import type { Doc } from "../../../../convex/_generated/dataModel.d.ts";

type QuestionCardProps = {
  question: Doc<"questions">;
  selectedOption: number | null;
  showFeedback: boolean;
  onSelectOption: (index: number) => void;
};

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  selectedOption,
  showFeedback,
  onSelectOption,
}: QuestionCardProps) {
  const getOptionStyle = (index: number) => {
    if (!showFeedback) {
      return "bg-card border-border hover:bg-accent active:scale-[0.98]";
    }
    if (index === question.correctOptionIndex) {
      return "bg-green-500/10 border-green-500 dark:bg-green-500/15";
    }
    if (index === selectedOption && index !== question.correctOptionIndex) {
      return "bg-red-500/10 border-red-500 dark:bg-red-500/15";
    }
    return "bg-card border-border opacity-40";
  };

  const getLetterStyle = (index: number) => {
    if (!showFeedback) {
      return "bg-secondary text-secondary-foreground";
    }
    if (index === question.correctOptionIndex) {
      return "bg-green-500 text-white";
    }
    if (index === selectedOption && index !== question.correctOptionIndex) {
      return "bg-red-500 text-white";
    }
    return "bg-secondary text-secondary-foreground";
  };

  const getLetterContent = (index: number) => {
    if (!showFeedback) return OPTION_LETTERS[index];
    if (index === question.correctOptionIndex)
      return <Check className="size-4" />;
    if (index === selectedOption && index !== question.correctOptionIndex)
      return <X className="size-4" />;
    return OPTION_LETTERS[index];
  };

  return (
    <div className="space-y-5">
      {/* Category & Difficulty badges */}
      <div className="flex gap-2 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
          {question.category}
        </span>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold",
            question.difficulty === "easy" &&
              "bg-green-500/10 text-green-600 dark:text-green-400",
            question.difficulty === "medium" &&
              "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            question.difficulty === "hard" &&
              "bg-red-500/10 text-red-600 dark:text-red-400",
          )}
        >
          {question.difficulty.charAt(0).toUpperCase() +
            question.difficulty.slice(1)}
        </span>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-bold leading-snug">{question.text}</h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && onSelectOption(index)}
            disabled={showFeedback}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
              getOptionStyle(index),
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center size-9 rounded-lg text-sm font-bold shrink-0 transition-colors",
                getLetterStyle(index),
              )}
            >
              {getLetterContent(index)}
            </span>
            <span className="text-sm font-medium leading-snug">{option}</span>
          </button>
        ))}
      </div>

      {/* Explanation shown during feedback */}
      {showFeedback && question.explanation && (
        <div className="p-4 rounded-xl bg-muted/60 border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Why? </span>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
