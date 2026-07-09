import { useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, RotateCcw, Home, Zap } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";
import { SignInButton } from "../../../components/ui/signin.tsx";
import { cn } from "../../../lib/utils.ts";
import { AdMob, InterstitialAdPluginEvents } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

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

  // PRELOAD THE AD
  // Since this component only mounts when the quiz is done, we run this immediately
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      AdMob.prepareInterstitial({
        adId: "ca-app-pub-8180341562401513/8178210202", // Google Test Interstitial Video ID
        isTesting: true, // REMOVE IN PRODUCTION
      }).catch(console.error);
    }
  }, []); // Empty bracket means it runs once when the screen appears

  // THE SMART ACTION WRAPPER
  // Instead of passing a path, it takes your onRetry or onHome functions
  const handleActionWithAd = async (actionCallback: () => void) => {
    if (Capacitor.isNativePlatform()) {
      try {
        // 1. Create a listener waiting for the user to close the ad
        const listener = await AdMob.addListener(
          InterstitialAdPluginEvents.Dismissed,
          () => {
            listener.remove(); // Clean up the listener
            actionCallback(); // Trigger onRetry or onHome AFTER ad closes
          },
        );

        // 2. Show the ad!
        await AdMob.showInterstitial();
        return;
      } catch (err) {
        console.error("Ad failed to show, skipping straight to action", err);
        actionCallback(); // Failsafe: if ad breaks, just let them click through
      }
    } else {
      // If they are on the website, just run the action normally
      actionCallback();
    }
  };

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

      {/* Action buttons with the smart Ad wrapper! */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full max-w-xs space-y-3 pt-2"
      >
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={() => handleActionWithAd(onRetry)}
        >
          <RotateCcw className="size-4" />
          Try Again
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="w-full gap-2"
          onClick={() => handleActionWithAd(onHome)}
        >
          <Home className="size-4" />
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}

// import { motion } from "motion/react";
// import { Trophy, RotateCcw, Home, Zap } from "lucide-react";
// import { Button } from "../../../components/ui/button.tsx";
// import { SignInButton } from "../../../components/ui/signin.tsx";
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
//     <div className="flex flex-col items-center justify-center min-h-[90vh] text-center space-y-8 px-4 py-4">
//       {/* Trophy icon */}
//       <motion.div
//         initial={{ scale: 0, rotate: -20 }}
//         animate={{ scale: 1, rotate: 0 }}
//         transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 12 }}
//         className="relative"
//       >
//         <div
//           className={cn(
//             "size-24 rounded-3xl flex items-center justify-center",
//             percentage >= 70
//               ? "bg-gradient-to-br from-amber-400 to-orange-500"
//               : "bg-gradient-to-br from-primary/80 to-primary",
//           )}
//         >
//           <Trophy className="size-12 text-white" />
//         </div>
//       </motion.div>

//       {/* Score */}
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

//       {/* Rating */}
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

//       {/* Grade badge */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.7, type: "spring" }}
//         className={cn(
//           "size-16 rounded-2xl flex items-center justify-center text-3xl font-black",
//           percentage >= 90 && "bg-green-500/15 text-green-500",
//           percentage >= 70 && percentage < 90 && "bg-blue-500/15 text-blue-500",
//           percentage >= 50 &&
//             percentage < 70 &&
//             "bg-amber-500/15 text-amber-500",
//           percentage < 50 && "bg-red-500/15 text-red-500",
//         )}
//       >
//         {rating.emoji}
//       </motion.div>

//       {/* Sign in prompt for unauthenticated users */}
//       {!isAuthenticated && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.9 }}
//           className="space-y-2"
//         >
//           <p className="text-sm text-muted-foreground">
//             Sign in to save your progress and compete on the leaderboard
//           </p>
//           <SignInButton />
//         </motion.div>
//       )}

//       {isAuthenticated && (
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.9 }}
//           className="text-sm text-green-600 dark:text-green-400 font-medium"
//         >
//           Score saved to your profile
//         </motion.p>
//       )}

//       {/* Action buttons */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1 }}
//         className="w-full max-w-xs space-y-3 pt-2"
//       >
//         <Button size="lg" className="w-full gap-2" onClick={onRetry}>
//           <RotateCcw className="size-4" />
//           Try Again
//         </Button>
//         <Button
//           size="lg"
//           variant="secondary"
//           className="w-full gap-2"
//           onClick={onHome}
//         >
//           <Home className="size-4" />
//           Back to Home
//         </Button>
//       </motion.div>
//     </div>
//   );
// }
