import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api.js";
import Papa from "papaparse";
import { Button } from "../../../components/ui/button.tsx";
import { Input } from "../../../components/ui/input.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card.tsx";
import { Upload, CheckCircle, AlertTriangle, FileDown } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, DIFFICULTIES } from "../../../lib/quiz-constants.ts";

const VALID_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all").map(
  (c) => c.id,
);
const VALID_DIFFICULTIES = DIFFICULTIES.filter((d) => d.id !== "all").map(
  (d) => d.id as string,
);

type CsvRow = {
  text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: string;
  category: string;
  difficulty: string;
  explanation: string;
};

type ParsedQuestion = {
  text: string;
  options: string[];
  correctOptionIndex: number;
  category: string;
  difficulty: string;
  explanation: string;
};

export default function CsvImport({ onDone }: { onDone: () => void }) {
  const bulkCreate = useMutation(api.questions.bulkCreate);
  const [parsed, setParsed] = useState<ParsedQuestion[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    inserted: number;
    total: number;
  } | null>(null);

  const downloadTemplate = () => {
    const header =
      "text,option1,option2,option3,option4,correctOption,category,difficulty,explanation";
    const example =
      '"What is the output of an AND gate when both inputs are 1?","0","1","Undefined","Depends on gate",2,"Digital Electronics","easy","An AND gate outputs 1 only when all inputs are 1."';
    const csvContent = `${header}\n${example}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setParsed([]);
    setErrors([]);
    setResult(null);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrors(results.errors.map((e) => `Row ${e.row}: ${e.message}`));
          return;
        }

        const requiredCols = [
          "text",
          "option1",
          "option2",
          "correctOption",
          "category",
          "difficulty",
          "explanation",
        ];
        const headers = results.meta.fields ?? [];
        const missing = requiredCols.filter((c) => !headers.includes(c));
        if (missing.length > 0) {
          setErrors([`Missing required columns: ${missing.join(", ")}`]);
          return;
        }

        const validationErrors: string[] = [];
        const questions: ParsedQuestion[] = [];

        results.data.forEach((row, i) => {
          const rowNum = i + 2;
          if (!row.text?.trim()) {
            validationErrors.push(`Row ${rowNum}: Missing question text`);
            return;
          }
          const opts = [row.option1, row.option2, row.option3, row.option4]
            .map((o) => (o ?? "").trim())
            .filter((o) => o.length > 0);
          if (opts.length < 2) {
            validationErrors.push(
              `Row ${rowNum}: At least 2 non-empty options needed`,
            );
            return;
          }
          const correctIdx = parseInt(String(row.correctOption), 10);
          if (isNaN(correctIdx) || correctIdx < 1 || correctIdx > opts.length) {
            validationErrors.push(
              `Row ${rowNum}: correctOption must be between 1 and ${opts.length}`,
            );
            return;
          }
          const cat = (row.category ?? "").trim();
          if (!VALID_CATEGORIES.includes(cat)) {
            validationErrors.push(
              `Row ${rowNum}: Invalid category "${cat}". Valid: ${VALID_CATEGORIES.join(", ")}`,
            );
            return;
          }
          const diff = (row.difficulty ?? "").trim().toLowerCase();
          if (!VALID_DIFFICULTIES.includes(diff)) {
            validationErrors.push(
              `Row ${rowNum}: Invalid difficulty "${diff}". Valid: ${VALID_DIFFICULTIES.join(", ")}`,
            );
            return;
          }
          if (!row.explanation?.trim()) {
            validationErrors.push(`Row ${rowNum}: Missing explanation`);
            return;
          }
          questions.push({
            text: row.text.trim(),
            options: opts,
            correctOptionIndex: correctIdx - 1,
            category: cat,
            difficulty: diff,
            explanation: row.explanation.trim(),
          });
        });

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        }
        if (questions.length > 0) {
          setParsed(questions);
        }
      },
      error: (error) => {
        setErrors([error.message]);
      },
    });
  };

  const handleImport = async () => {
    if (parsed.length === 0) return;
    setImporting(true);
    try {
      const res = await bulkCreate({ questions: parsed });
      setResult(res);
      toast.success(`Imported ${res.inserted} questions`);
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="size-5" />
          Import from CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template download */}
        <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Download the template to see the expected format. Columns:
          </p>
          <p className="text-xs font-mono text-muted-foreground">
            text, option1, option2, option3, option4, correctOption (1-4),
            category, difficulty, explanation
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={downloadTemplate}
            className="cursor-pointer"
          >
            <FileDown className="size-4 mr-1" />
            Download template
          </Button>
        </div>

        {/* File input */}
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="cursor-pointer"
        />

        {/* Errors */}
        {errors.length > 0 && (
          <div className="border border-destructive/30 bg-destructive/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
              <AlertTriangle className="size-4" />
              Validation Errors ({errors.length})
            </div>
            <ul className="text-xs text-destructive space-y-1 max-h-40 overflow-y-auto">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preview */}
        {parsed.length > 0 && !result && (
          <div className="space-y-3">
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <CheckCircle className="size-4" />
                {parsed.length} questions ready to import
              </div>
              <div className="text-xs text-muted-foreground space-y-1 max-h-32 overflow-y-auto">
                {parsed.slice(0, 5).map((q, i) => (
                  <p key={i} className="truncate">
                    {i + 1}. {q.text}
                  </p>
                ))}
                {parsed.length > 5 && (
                  <p className="text-muted-foreground/70">
                    ...and {parsed.length - 5} more
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleImport}
              disabled={importing}
              className="w-full cursor-pointer"
            >
              {importing ? "Importing..." : `Import ${parsed.length} Questions`}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <CheckCircle className="size-4" />
              Successfully imported {result.inserted} of {result.total}{" "}
              questions
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
