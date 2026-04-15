import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Zap, ChevronRight, LogIn, Settings } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInButton } from "../components/ui/signin.tsx";
import { useUser } from "@clerk/clerk-react"; // Using Clerk's hook for the name display
import {
  CATEGORIES,
  DIFFICULTIES,
  QUESTION_COUNTS,
} from "../lib/quiz-constants.ts";
import { cn } from "../lib/utils.ts";

export default function Index() {
  const navigate = useNavigate();
  const { user: clerkUser } = useUser();

  // 1. Fetch the user from Convex to check their role
  const convexUser = useQuery(api.users.getCurrentUser);
  const isAdmin = convexUser?.role === "admin";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [questionCount, setQuestionCount] = useState(10);

  const handleStartQuiz = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedDifficulty !== "all")
      params.set("difficulty", selectedDifficulty);
    params.set("count", questionCount.toString());
    navigate(`/quiz?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-10 pb-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <Zap className="size-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">CircuitIQ</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Test your Electronics {"&"} Computer knowledge
          </p>
        </motion.div>

        {/* Auth status bar */}
        <div className="mt-5 flex justify-center">
          <Authenticated>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full"
            >
              Playing as{" "}
              <span className="font-semibold text-foreground">
                {/* Clerk uses firstName or fullName, not profile.name */}
                {clerkUser?.firstName || "User"}
              </span>
            </motion.p>
          </Authenticated>

          <Unauthenticated>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
              <LogIn className="size-3" />
              <span>Sign in to save progress</span>
              <SignInButton />
            </div>
          </Unauthenticated>
        </div>

        {/* Manage questions link */}
        {isAdmin && (
          <Authenticated>
            <div className="mt-3 flex justify-center">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate("/manage-questions")}
                className="flex items-center gap-1.5 text-xs font-medium text-primary transition-all cursor-pointer mt-1"
              >
                <Settings className="size-3.5" />
                Manage Questions
              </motion.button>
            </div>
          </Authenticated>
        )}
      </div>

      {/* Topic Selection */}
      <div className="px-4 pb-6 max-w-lg mx-auto">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Choose a Topic
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.4,
                  ease: "easeOut" as const,
                }}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "relative overflow-hidden rounded-xl p-3.5 text-left transition-all cursor-pointer",
                  "border-2",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md dark:bg-primary/10"
                    : "border-transparent bg-card hover:bg-accent",
                )}
              >
                <div
                  className={cn(
                    "inline-flex items-center justify-center size-9 rounded-lg mb-2",
                    "bg-gradient-to-br",
                    cat.gradient,
                    "text-white shadow-sm",
                  )}
                >
                  <Icon className="size-4.5" />
                </div>
                <p className="font-semibold text-xs leading-tight">
                  {cat.name}
                </p>
                {isSelected && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute top-2 right-2 size-2 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div className="px-4 pb-5 max-w-lg mx-auto">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Difficulty
        </h2>
        <div className="flex gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                selectedDifficulty === diff.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div className="px-4 pb-8 max-w-lg mx-auto">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
          Number of Questions
        </h2>
        <div className="flex gap-2">
          {QUESTION_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setQuestionCount(count)}
              className={cn(
                "flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                questionCount === count
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div className="px-4 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" as const }}
        >
          <Button
            size="lg"
            className="w-full h-14 text-base font-bold rounded-xl gap-2 shadow-lg"
            onClick={handleStartQuiz}
          >
            Start Quiz
            <ChevronRight className="size-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// export default function Index() {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedDifficulty, setSelectedDifficulty] = useState("all");
//   const [questionCount, setQuestionCount] = useState(10);

//   const handleStartQuiz = () => {
//     const params = new URLSearchParams();
//     if (selectedCategory !== "all") params.set("category", selectedCategory);
//     if (selectedDifficulty !== "all")
//       params.set("difficulty", selectedDifficulty);
//     params.set("count", questionCount.toString());
//     navigate(`/quiz?${params.toString()}`);
//   };

//   // if (isLoading) {
//   //   return <div>Loading CircuitIQ...</div>; // Prevents the crash
//   // }

//   return (
//     <div className="min-h-screen bg-background pb-24">
//       {/* Header */}
//       <div className="px-4 pt-10 pb-6 max-w-lg mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: -15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: "easeOut" as const }}
//           className="text-center"
//         >
//           <div className="flex items-center justify-center gap-2.5 mb-2">
//             <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
//               <Zap className="size-5 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold tracking-tight">CircuitIQ</h1>
//           </div>
//           <p className="text-sm text-muted-foreground">
//             Test your Electronics {"&"} Computer knowledge
//           </p>
//         </motion.div>

//         {/* Auth status bar */}
//         <div className="mt-5 flex justify-center">
//           <Authenticated>
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full"
//             >
//               Playing as{" "}
//               <span className="font-semibold text-foreground">
//                 {/* Clerk uses firstName or fullName, not profile.name */}
//                 {user?.firstName || user?.fullName || "User"}
//               </span>
//             </motion.p>
//           </Authenticated>
//           <Unauthenticated>
//             <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
//               <LogIn className="size-3" />
//               <span>Sign in to save progress</span>
//               <SignInButton />
//             </div>
//           </Unauthenticated>
//         </div>
//       </div>

//       {/* Topic Selection */}
//       <div className="px-4 pb-6 max-w-lg mx-auto">
//         <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
//           Choose a Topic
//         </h2>
//         <div className="grid grid-cols-2 gap-2.5">
//           {CATEGORIES.map((cat, index) => {
//             const Icon = cat.icon;
//             const isSelected = selectedCategory === cat.id;
//             return (
//               <motion.button
//                 key={cat.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{
//                   delay: index * 0.04,
//                   duration: 0.4,
//                   ease: "easeOut" as const,
//                 }}
//                 onClick={() => setSelectedCategory(cat.id)}
//                 className={cn(
//                   "relative overflow-hidden rounded-xl p-3.5 text-left transition-all cursor-pointer",
//                   "border-2",
//                   isSelected
//                     ? "border-primary bg-primary/5 shadow-md dark:bg-primary/10"
//                     : "border-transparent bg-card hover:bg-accent",
//                 )}
//               >
//                 <div
//                   className={cn(
//                     "inline-flex items-center justify-center size-9 rounded-lg mb-2",
//                     "bg-gradient-to-br",
//                     cat.gradient,
//                     "text-white shadow-sm",
//                   )}
//                 >
//                   <Icon className="size-4.5" />
//                 </div>
//                 <p className="font-semibold text-xs leading-tight">
//                   {cat.name}
//                 </p>
//                 {isSelected && (
//                   <motion.div
//                     layoutId="category-indicator"
//                     className="absolute top-2 right-2 size-2 rounded-full bg-primary"
//                   />
//                 )}
//               </motion.button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Difficulty */}
//       <div className="px-4 pb-5 max-w-lg mx-auto">
//         <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
//           Difficulty
//         </h2>
//         <div className="flex gap-2">
//           {DIFFICULTIES.map((diff) => (
//             <button
//               key={diff.id}
//               onClick={() => setSelectedDifficulty(diff.id)}
//               className={cn(
//                 "flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
//                 selectedDifficulty === diff.id
//                   ? "bg-primary text-primary-foreground shadow-md"
//                   : "bg-secondary text-secondary-foreground hover:bg-accent",
//               )}
//             >
//               {diff.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Question Count */}
//       <div className="px-4 pb-8 max-w-lg mx-auto">
//         <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
//           Number of Questions
//         </h2>
//         <div className="flex gap-2">
//           {QUESTION_COUNTS.map((count) => (
//             <button
//               key={count}
//               onClick={() => setQuestionCount(count)}
//               className={cn(
//                 "flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
//                 questionCount === count
//                   ? "bg-primary text-primary-foreground shadow-md"
//                   : "bg-secondary text-secondary-foreground hover:bg-accent",
//               )}
//             >
//               {count}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Start button */}
//       <div className="px-4 max-w-lg mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" as const }}
//         >
//           <Button
//             size="lg"
//             className="w-full h-14 text-base font-bold rounded-xl gap-2 shadow-lg"
//             onClick={handleStartQuiz}
//           >
//             Start Quiz
//             <ChevronRight className="size-5" />
//           </Button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
