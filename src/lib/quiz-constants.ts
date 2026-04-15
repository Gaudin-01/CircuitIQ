import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Zap,
  Globe,
  Lightbulb,
  Cog,
  ToggleRight,
  Shuffle,
} from "lucide-react";

export type CategoryDef = {
  id: string;
  name: string;
  icon: LucideIcon;
  gradient: string;
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: "all",
    name: "All Topics",
    icon: Shuffle,
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    id: "Digital Electronics",
    name: "Digital Electronics",
    icon: ToggleRight,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "Computer Architecture",
    name: "Computer Architecture",
    icon: Cpu,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "Circuit Theory",
    name: "Circuit Theory",
    icon: Zap,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "Semiconductor Devices",
    name: "Semiconductor Devices",
    icon: Lightbulb,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "Microprocessors",
    name: "Microprocessors",
    icon: Cog,
    gradient: "from-red-500 to-rose-500",
  },
  {
    id: "Computer Networking",
    name: "Computer Networking",
    icon: Globe,
    gradient: "from-teal-500 to-cyan-500",
  },
];

export const DIFFICULTIES = [
  { id: "all", label: "All" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
] as const;

export const QUESTION_COUNTS = [5, 10, 15, 20] as const;

export const TIME_PER_QUESTION = 25;
