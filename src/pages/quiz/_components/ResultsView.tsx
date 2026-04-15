// import { motion } from "motion/react";
// import { Trophy, RotateCcw, Home, Zap } from "lucide-react";
// import { Button } from "../../../components/ui/button.tsx";
// import { SignInButton } from "@clerk/clerk-react"; // Ensure correct Clerk import
// import { cn } from "../../../lib/utils.ts";

// type ResultsViewProps = {
//   score: number;
//   totalQuestions: number;
//   category: string;
//   difficulty: string;
//   onRetry: () => void;
//   onHome: () => void;
//   isAuthenticated: boolean;
// };

// function getRating(percentage: number) {
//   if (percentage >= 90)
//     return { label: "Excellent!", emoji: "A", color: "text-green-500" };
//   if (percentage >= 70)
//     return { label: "Great Job!", emoji: "B", color: "text-blue-500" };
//   if (percentage >= 50)
//     return { label: "Not Bad!", emoji: "C", color: "text-amber-500" };
//   return { label: "Keep Practicing!", emoji: "D", color: "text-red-500" };
// }

// export default function ResultsView({
//   score,
//   totalQuestions,
//   category,
//   difficulty,
//   onRetry,
//   onHome,
//   isAuthenticated,
// }: ResultsViewProps) {
//   const percentage = Math.round((score / totalQuestions) * 100);
//   const rating = getRating(percentage);

//   return (
//     // min-h-screen and flex items-center ensures the results are perfectly centered vertically
//     <div className="flex flex-col items-center justify-center min-h-[90vh] text-center space-y-8 px-4 py-10">
//       <motion.div
//         initial={{ scale: 0, rotate: -20 }}
//         animate={{ scale: 1, rotate: 0 }}
//         transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 12 }}
//         className="relative"
//       >
//         <div
//           className={cn(
//             "size-24 rounded-3xl flex items-center justify-center shadow-lg",
//             percentage >= 70
//               ? "bg-gradient-to-br from-amber-400 to-orange-500"
//               : "bg-gradient-to-br from-primary/80 to-primary",
//           )}
//         >
//           <Trophy className="size-12 text-white" />
//         </div>
//       </motion.div>

//       <div className="space-y-2">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.5 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
//           className="text-6xl font-bold tracking-tight"
//         >
//           {percentage}
//           <span className="text-3xl text-muted-foreground">%</span>
//         </motion.div>
//         <motion.p
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="text-muted-foreground"
//         >
//           {score} out of {totalQuestions} correct
//         </motion.p>
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 15 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.6 }}
//         className="space-y-1"
//       >
//         <div
//           className={cn(
//             "inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold",
//             rating.color,
//             "bg-current/10",
//           )}
//         >
//           <Zap className="size-5" />
//           {rating.label}
//         </div>
//         <p className="text-sm text-muted-foreground">
//           {category} &middot;{" "}
//           {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
//         </p>
//       </motion.div>

//       {/* Sign in prompt / Save status */}
//       <div className="h-12">
//         {" "}
//         {/* Fixed height to prevent layout shift */}
//         {!isAuthenticated ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="space-y-2"
//           >
//             <p className="text-xs text-muted-foreground mb-2">
//               Sign in to save this score to your profile
//             </p>
//             <SignInButton mode="modal">
//               <Button variant="outline" size="sm" className="rounded-full">
//                 Sign In to Save Progress
//               </Button>
//             </SignInButton>
//           </motion.div>
//         ) : (
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2"
//           >
//             <ShieldCheck className="size-4" /> Score saved to profile
//           </motion.p>
//         )}
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.8 }}
//         className="w-full max-w-xs space-y-3 pt-4"
//       >
//         <Button
//           size="lg"
//           className="w-full gap-2 text-base font-bold shadow-md"
//           onClick={() => {
//             console.log("Retry clicked"); // Debugging line
//             onRetry();
//           }}
//         >
//           <RotateCcw className="size-5" />
//           Try Again
//         </Button>
//         <Button
//           size="lg"
//           variant="ghost"
//           className="w-full gap-2 text-muted-foreground"
//           onClick={onHome}
//         >
//           <Home className="size-5" />
//           Back to Home
//         </Button>
//       </motion.div>
//     </div>
//   );
// }

// // Sub-component helper for the icon
// function ShieldCheck({ className }: { className?: string }) {
//   return (
//     <svg
//       className={className}
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
//       <path d="m9 12 2 2 4-4" />
//     </svg>
//   );
// }

import { motion } from "motion/react";
import { Trophy, RotateCcw, Home, Zap } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";
import { SignInButton } from "../../../components/ui/signin.tsx";
import { cn } from "../../../lib/utils.ts";

type ResultsViewProps = {
  score: number;
  totalQuestions: number;
  category: string;
  difficulty: string;
  onRetry: () => void;
  onHome: () => void;
  isAuthenticated: boolean;
};

function getRating(percentage: number) {
  if (percentage >= 90)
    return { label: "Excellent!", emoji: "A", color: "text-green-500" };
  if (percentage >= 70)
    return { label: "Great Job!", emoji: "B", color: "text-blue-500" };
  if (percentage >= 50)
    return { label: "Not Bad!", emoji: "C", color: "text-amber-500" };
  return { label: "Keep Practicing!", emoji: "D", color: "text-red-500" };
}

export default function ResultsView({
  score,
  totalQuestions,
  category,
  difficulty,
  onRetry,
  onHome,
  isAuthenticated,
}: ResultsViewProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const rating = getRating(percentage);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center space-y-8 px-4 py-4">
      {/* Trophy icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 12 }}
        className="relative"
      >
        <div
          className={cn(
            "size-24 rounded-3xl flex items-center justify-center",
            percentage >= 70
              ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : "bg-gradient-to-br from-primary/80 to-primary",
          )}
        >
          <Trophy className="size-12 text-white" />
        </div>
      </motion.div>

      {/* Score */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
          className="text-6xl font-bold tracking-tight"
        >
          {percentage}
          <span className="text-3xl text-muted-foreground">%</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          {score} out of {totalQuestions} correct
        </motion.p>
      </div>

      {/* Rating */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-1"
      >
        <div
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold",
            rating.color,
            "bg-current/10",
          )}
        >
          <Zap className="size-5" />
          {rating.label}
        </div>
        <p className="text-sm text-muted-foreground">
          {category} &middot;{" "}
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </p>
      </motion.div>

      {/* Grade badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        className={cn(
          "size-16 rounded-2xl flex items-center justify-center text-3xl font-black",
          percentage >= 90 && "bg-green-500/15 text-green-500",
          percentage >= 70 && percentage < 90 && "bg-blue-500/15 text-blue-500",
          percentage >= 50 &&
            percentage < 70 &&
            "bg-amber-500/15 text-amber-500",
          percentage < 50 && "bg-red-500/15 text-red-500",
        )}
      >
        {rating.emoji}
      </motion.div>

      {/* Sign in prompt for unauthenticated users */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-2"
        >
          <p className="text-sm text-muted-foreground">
            Sign in to save your progress and compete on the leaderboard
          </p>
          <SignInButton />
        </motion.div>
      )}

      {isAuthenticated && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-green-600 dark:text-green-400 font-medium"
        >
          Score saved to your profile
        </motion.p>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full max-w-xs space-y-3 pt-2"
      >
        <Button size="lg" className="w-full gap-2" onClick={onRetry}>
          <RotateCcw className="size-4" />
          Try Again
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full gap-2"
          onClick={onHome}
        >
          <Home className="size-4" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
