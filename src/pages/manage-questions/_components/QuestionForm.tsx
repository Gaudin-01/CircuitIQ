import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api.js";
import type { Doc } from "../../../../convex/_generated/dataModel.d.ts";
import { Button } from "../../../components/ui/button.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card.tsx";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, DIFFICULTIES } from "../../../lib/quiz-constants.ts";
import { cn } from "../../../lib/utils.ts";

const TOPIC_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");
const DIFFICULTY_OPTIONS = DIFFICULTIES.filter((d) => d.id !== "all");

type QuestionFormProps = {
  editingQuestion?: Doc<"questions"> | null;
  onDone: () => void;
};

export default function QuestionForm({
  editingQuestion,
  onDone,
}: QuestionFormProps) {
  const createQuestion = useMutation(api.questions.create);
  const updateQuestion = useMutation(api.questions.update);

  const [text, setText] = useState(editingQuestion?.text ?? "");
  const [options, setOptions] = useState<string[]>(
    editingQuestion?.options ?? ["", "", "", ""],
  );
  const [correctIndex, setCorrectIndex] = useState(
    editingQuestion?.correctOptionIndex ?? 0,
  );
  const [category, setCategory] = useState(
    editingQuestion?.category ?? TOPIC_CATEGORIES[0].id,
  );
  const [difficulty, setDifficulty] = useState(
    editingQuestion?.difficulty ?? "easy",
  );
  const [explanation, setExplanation] = useState(
    editingQuestion?.explanation ?? "",
  );
  const [saving, setSaving] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    if (correctIndex >= updated.length) {
      setCorrectIndex(updated.length - 1);
    } else if (correctIndex === index) {
      setCorrectIndex(0);
    } else if (correctIndex > index) {
      setCorrectIndex(correctIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOptions = options
      .map((o) => o.trim())
      .filter((o) => o.length > 0);
    if (!text.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (trimmedOptions.length < 2) {
      toast.error("At least 2 options are required");
      return;
    }
    if (!explanation.trim()) {
      toast.error("Explanation is required");
      return;
    }

    setSaving(true);
    try {
      if (editingQuestion) {
        await updateQuestion({
          id: editingQuestion._id,
          text: text.trim(),
          options: trimmedOptions,
          correctOptionIndex: correctIndex,
          category,
          difficulty,
          explanation: explanation.trim(),
        });
        toast.success("Question updated");
      } else {
        await createQuestion({
          text: text.trim(),
          options: trimmedOptions,
          correctOptionIndex: correctIndex,
          category,
          difficulty,
          explanation: explanation.trim(),
        });
        toast.success("Question created");
      }
      onDone();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save question",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">
          {editingQuestion ? "Edit Question" : "New Question"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDone}
          className="cursor-pointer"
        >
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question text */}
          <div className="space-y-2">
            <Label htmlFor="question-text">Question</Label>
            <Textarea
              id="question-text"
              placeholder="e.g. What is the output of an AND gate when both inputs are 1?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
            />
          </div>

          {/* Category + Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TOPIC_CATEGORIES.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={c.id}
                      className="cursor-pointer"
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <SelectItem
                      key={d.id}
                      value={d.id}
                      className="cursor-pointer"
                    >
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label>Answer Options</Label>
            <p className="text-xs text-muted-foreground">
              Click the radio to mark the correct answer
            </p>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrectIndex(i)}
                    className={cn(
                      "shrink-0 size-5 rounded-full border-2 transition-colors cursor-pointer flex items-center justify-center",
                      correctIndex === i
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40 hover:border-primary",
                    )}
                  >
                    {correctIndex === i && (
                      <div className="size-2 rounded-full bg-primary-foreground" />
                    )}
                  </button>
                  <Input
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 cursor-pointer text-destructive hover:text-destructive"
                      onClick={() => removeOption(i)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={addOption}
              >
                <Plus className="size-4 mr-1" />
                Add option
              </Button>
            )}
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea
              id="explanation"
              placeholder="Explain why the correct answer is right..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer"
          >
            <Save className="size-4 mr-2" />
            {saving
              ? "Saving..."
              : editingQuestion
                ? "Update Question"
                : "Create Question"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
