import QuizPage from "./pages/quiz/page";
import ProgressPage from "./pages/progress/page";
import LeaderboardPage from "./pages/leaderboard/page";
import ProfilePage from "./pages/profile/page";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AuthCallback from "./pages/auth/Callback"; 
import ManageQuestionsPage from "./pages/manage-questions/page";
import WhatsAppButton from "./components/WhatsAppButton";
import UsernameForm from "./components/UsernameForm";
import Dashboard from "./pages/dashboard/page";
import { Toaster } from "sonner";
import { useEffect } from "react";
import {
  useQuery,
  useConvexAuth,
  useMutation,
  ConvexReactClient,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { App as CapApp } from "@capacitor/app";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";

// CLERK & CONVEX INTEGRATION
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key! Check your .env.local file.");
}

// 1. New component to handle Android deep links
function DeepLinkHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    CapApp.addListener("appUrlOpen", (event) => {
      const url = new URL(event.url);
      const path = url.pathname + url.search;
      navigate(path);
    });
  }, [navigate]);
  return null;
}

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSessionWrapper>
          <HashRouter>
            <DeepLinkHandler />
            <Toaster position="top-center" richColors />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route
                path="/manage-questions"
                element={<ManageQuestionsPage />}
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
            <WhatsAppButton />
            <BottomNav />
          </HashRouter>
        </UserSessionWrapper>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function UserSessionWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.updateCurrentUser);
const user = useQuery(api.users.getCurrentUser);
  useEffect(() => {
    if (isAuthenticated) {
      // We add a small delay to ensure the Clerk session is fully ready
      const timeout = setTimeout(() => {
        storeUser().catch((err) => console.error("Sync failed:", err));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, storeUser]);

  // Prevent rendering the app until we know the auth state
  if (isLoading || (isAuthenticated && user === undefined)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">
          Connecting to CircuitIQ...
        </p>
      </div>
    );
  }
  if (isAuthenticated && user && !user.username) {
    return (
      <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
        <UsernameForm />
      </div>
    );
  }

  return <>{children}</>;
}