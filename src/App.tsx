import QuizPage from "./pages/quiz/page.tsx";
import ProgressPage from "./pages/progress/page.tsx";
import LeaderboardPage from "./pages/leaderboard/page.tsx";
import ProfilePage from "./pages/profile/page.tsx";
import BottomNav from "./components/BottomNav.tsx";
import NotFound from "./pages/NotFound.tsx";
import Index from "./pages/Index.tsx"; // UNCOMMENTED
import AuthCallback from "./pages/auth/Callback.tsx"; // UNCOMMENTED
import ManageQuestionsPage from "./pages/manage-questions/page.tsx";
import WhatsAppButton from "./components/WhatsAppButton";

import { Toaster } from "sonner";
import { useEffect } from "react"; // Added this import
import { App as CapApp } from "@capacitor/app";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";

// CLERK & CONVEX INTEGRATION
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

// Initialize the Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
// Grab your Clerk key from .env.local
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key! Check your .env.local file.");
}

// 1. New component to handle Android deep links
function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    CapApp.addListener("appUrlOpen", (event) => {
      // Example event.url: "com.circuitiq.app:///auth/callback?token=..."
      const url = new URL(event.url);
      
      // For HashRouter, we need to extract the path correctly
      const path = url.pathname + url.search;
      
      // Redirect inside the app
      navigate(path);
    });
  }, [navigate]);

  return null; // This component doesn't render anything
}

export default function App() {
  // useServiceWorker();

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {/* You must wrap the children here for the useEffect to run */}
        <UserSessionWrapper>
          <HashRouter>
            <DeepLinkHandler /> {/* Handle deep links on Android */}
            
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

import { useConvexAuth } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function UserSessionWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const storeUser = useMutation(api.users.updateCurrentUser);

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
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">
          Connecting to CircuitIQ...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
