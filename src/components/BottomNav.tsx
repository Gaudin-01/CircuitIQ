import { useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart3, Trophy, User } from "lucide-react";
import { cn } from "../lib/utils.ts";

const NAV_ITEMS = [
  { path: "/", label: "Play", icon: Home },
  { path: "/leaderboard", label: "Ranks", icon: Trophy },
  { path: "/progress", label: "Progress", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: User },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide bottom nav on quiz page
  if (location.pathname === "/quiz") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t safe-area-bottom">
      <div className="flex justify-around items-center max-w-lg mx-auto h-16">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-colors cursor-pointer",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
