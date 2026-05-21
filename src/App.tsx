import QuizPage from "./pages/quiz/page";
import ProgressPage from "./pages/progress/page";
import LeaderboardPage from "./pages/leaderboard/page";
import ProfilePage from "./pages/profile/page";
import BottomNav from "./components/BottomNav";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import ManageQuestionsPage from "./pages/manage-questions/page";
import WhatsAppButton from "./components/WhatsAppButton";
import UsernameForm from "./components/UsernameForm";
import Dashboard from "./pages/dashboard/page";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";

import { App as CapacitorApp } from "@capacitor/app";
import { AdMob } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

// 1. AdMob Initialization
function AdMobInitializer() {
  useEffect(() => {
    const initializeAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await AdMob.initialize({});
          console.log("AdMob initialized successfully");
        } catch (error) {
          console.error("AdMob initialization failed", error);
        }
      }
    };
    initializeAdMob();
  }, []);
  return null;
}

// 2. The Smart Deep Link Listener (Now safely inside the Router!)
function DeepLinkListener() {
  const navigate = useNavigate();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener("appUrlOpen", (event) => {
        const url = new URL(event.url);
        // If the OS hands us our custom scheme back from Chrome...
        if (url.protocol === "com.circuitiq.app:") {
          navigate(url.pathname + url.search);
        }
      });
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, [navigate]);

  return null;
}

// 3. Main App Component
export default function App() {
  return (
    <UserSessionWrapper>
      <HashRouter>
        {/* The listener is now safely inside the HashRouter */}
        <DeepLinkListener />
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/manage-questions" element={<ManageQuestionsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <AdMobInitializer />
        <WhatsAppButton />
        <BottomNav />
      </HashRouter>
    </UserSessionWrapper>
  );
}

// 4. Session Wrapper
function UserSessionWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);

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

// import QuizPage from "./pages/quiz/page";
// import ProgressPage from "./pages/progress/page";
// import LeaderboardPage from "./pages/leaderboard/page";
// import ProfilePage from "./pages/profile/page";
// import BottomNav from "./components/BottomNav";
// import NotFound from "./pages/NotFound";
// import Index from "./pages/Index";
// import ManageQuestionsPage from "./pages/manage-questions/page";
// import WhatsAppButton from "./components/WhatsAppButton";
// import UsernameForm from "./components/UsernameForm";
// import Dashboard from "./pages/dashboard/page";
// import { Toaster } from "sonner";
// import { useEffect } from "react";
// import { useQuery, useConvexAuth } from "convex/react"; // Removed useMutation
// import { api } from "../convex/_generated/api";
// import { App as CapApp } from "@capacitor/app";
// import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";

// import { App as CapacitorApp } from "@capacitor/app";
// import { AdMob } from "@capacitor-community/admob";
// import { Capacitor } from "@capacitor/core";

// // Inside your App.tsx, perhaps right above DeepLinkHandler
// function AdMobInitializer() {
//   useEffect(() => {
//     const initializeAdMob = async () => {
//       // Only initialize if we are actually running on a mobile device
//       if (Capacitor.isNativePlatform()) {
//         try {
//           await AdMob.initialize({});
//           console.log("AdMob initialized successfully");
//         } catch (error) {
//           console.error("AdMob initialization failed", error);
//         }
//       }
//     };
//     initializeAdMob();
//   }, []);
//   return null;
// }

// function DeepLinkHandler() {

//   const navigate = useNavigate();

//   useEffect(() => {
//     CapApp.addListener("appUrlOpen", (event) => {
//       const url = new URL(event.url);
//       const path = url.pathname + url.search;
//       navigate(path);
//     });
//   }, [navigate]);
//   return null;
// }

// export default function App() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Only listen for deep links if we are running natively
//     if (Capacitor.isNativePlatform()) {
//       CapacitorApp.addListener("appUrlOpen", (event) => {
//         const url = new URL(event.url);

//         // If the OS hands us our custom scheme back from Chrome...
//         if (url.protocol === "com.circuitiq.app:") {
//           // Push the exact URL path and auth tokens into our React Router!
//           // Convex will automatically see the code and log the user in.
//           navigate(url.pathname + url.search);
//         }
//       });
//     }

//     // Cleanup listener when app closes
//     return () => {
//       if (Capacitor.isNativePlatform()) {
//         CapacitorApp.removeAllListeners();
//       }
//     };
//   }, [navigate]);

//   return (
//     <UserSessionWrapper>
//       <HashRouter>
//         <DeepLinkHandler />
//         <Toaster position="top-center" richColors />
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/quiz" element={<QuizPage />} />
//           <Route path="/progress" element={<ProgressPage />} />
//           <Route path="/leaderboard" element={<LeaderboardPage />} />
//           <Route path="/manage-questions" element={<ManageQuestionsPage />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="*" element={<NotFound />} />
//           <Route path="/profile" element={<ProfilePage />} />
//         </Routes>
//         <AdMobInitializer />
//         <WhatsAppButton />
//         <BottomNav />
//       </HashRouter>
//     </UserSessionWrapper>
//   );
// }

// function UserSessionWrapper({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated, isLoading } = useConvexAuth();
//   const user = useQuery(api.users.getCurrentUser);

//   // Prevent rendering the app until we know the auth state
//   if (isLoading || (isAuthenticated && user === undefined)) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-muted-foreground animate-pulse">
//           Connecting to CircuitIQ...
//         </p>
//       </div>
//     );
//   }

//   // Force username selection if they don't have one
//   if (isAuthenticated && user && !user.username) {
//     return (
//       <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
//         <UsernameForm />
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
