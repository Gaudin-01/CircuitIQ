import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import type { Doc } from "../../../convex/_generated/dataModel.d.ts";
import { motion, AnimatePresence } from "motion/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInButton } from "../../components/ui/signin.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Skeleton } from "../../components/ui/skeleton.tsx";
import { Card, CardContent } from "../../components/ui/card.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "../../components/ui/empty.tsx";
import {
  Plus,
  Upload,
  Pencil,
  Trash2,
  Search,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.ts";
import QuestionForm from "./_components/QuestionForm.tsx";
import CsvImport from "./_components/CsvImport.tsx";

type ViewMode = "list" | "create" | "edit" | "import";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

function ManageQuestionsInner() {
  const questions = useQuery(api.questions.getAll, {});
  const removeQuestion = useMutation(api.questions.remove);
  const navigate = useNavigate();

  const [view, setView] = useState<ViewMode>("list");
  const [editingQuestion, setEditingQuestion] =
    useState<Doc<"questions"> | null>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Doc<"questions"> | null>(
    null,
  );

  const filteredQuestions = (questions ?? []).filter(
    (q) =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (q: Doc<"questions">) => {
    setEditingQuestion(q);
    setView("edit");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeQuestion({ id: deleteTarget._id });
      toast.success("Question deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
    setDeleteTarget(null);
  };

  const handleFormDone = () => {
    setView("list");
    setEditingQuestion(null);
  };

  if (questions === undefined) {
    return (
      <div className="space-y-3 p-4 max-w-2xl mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (view === "list" ? navigate("/") : setView("list"))}
            className="cursor-pointer shrink-0"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="font-bold text-lg flex-1 truncate">
            {view === "list" && "Manage Questions"}
            {view === "create" && "New Question"}
            {view === "edit" && "Edit Question"}
            {view === "import" && "Import CSV"}
          </h1>
          {view === "list" && (
            <Badge variant="secondary" className="font-mono">
              {questions.length}
            </Badge>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {/* ---- LIST VIEW ---- */}
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setView("create")}
                  className="flex-1 cursor-pointer"
                >
                  <Plus className="size-4 mr-2" />
                  Add Question
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setView("import")}
                  className="flex-1 cursor-pointer"
                >
                  <Upload className="size-4 mr-2" />
                  Import CSV
                </Button>
              </div>

              {/* Search */}
              {questions.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}

              {/* Empty state */}
              {questions.length === 0 && (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <HelpCircle />
                    </EmptyMedia>
                    <EmptyTitle>No questions yet</EmptyTitle>
                    <EmptyDescription>
                      Add questions manually or import them from a CSV file
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setView("create")}
                        className="cursor-pointer"
                      >
                        <Plus className="size-4 mr-1" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setView("import")}
                        className="cursor-pointer"
                      >
                        <Upload className="size-4 mr-1" />
                        Import
                      </Button>
                    </div>
                  </EmptyContent>
                </Empty>
              )}

              {/* Question list */}
              {filteredQuestions.length > 0 && (
                <div className="space-y-2">
                  {filteredQuestions.map((q, index) => (
                    <motion.div
                      key={q._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(index * 0.03, 0.3),
                        ease: "easeOut" as const,
                      }}
                    >
                      <Card className="py-0">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-snug line-clamp-2">
                                {q.text}
                              </p>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
                                  {q.category}
                                </span>
                                <span
                                  className={cn(
                                    "text-xs font-medium px-2 py-0.5 rounded-md capitalize",
                                    DIFFICULTY_COLORS[q.difficulty] ??
                                      "bg-secondary text-secondary-foreground",
                                  )}
                                >
                                  {q.difficulty}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {q.options.length} options
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 cursor-pointer"
                                onClick={() => handleEdit(q)}
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 cursor-pointer text-destructive hover:text-destructive"
                                onClick={() => setDeleteTarget(q)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* No search results */}
              {questions.length > 0 &&
                filteredQuestions.length === 0 &&
                search && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No questions match "{search}"
                  </p>
                )}
            </motion.div>
          )}

          {/* ---- CREATE / EDIT VIEW ---- */}
          {(view === "create" || view === "edit") && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuestionForm
                editingQuestion={view === "edit" ? editingQuestion : null}
                onDone={handleFormDone}
              />
            </motion.div>
          )}

          {/* ---- IMPORT VIEW ---- */}
          {view === "import" && (
            <motion.div
              key="import"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CsvImport onDone={() => setView("list")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete question?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this question. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ManageQuestionsPage() {
  return (
    <>
      <AuthLoading>
        <div className="p-4 max-w-2xl mx-auto space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </AuthLoading>
      <Authenticated>
        <ManageQuestionsInner />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-muted-foreground text-sm">
            Sign in to manage questions
          </p>
          <SignInButton />
        </div>
      </Unauthenticated>
    </>
  );
}
