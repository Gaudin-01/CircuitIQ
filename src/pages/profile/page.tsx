import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../../components/ui/button";
import { LogOut, User, Mail, ShieldCheck, LogIn } from "lucide-react";
import {
  useClerk,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function ProfilePage() {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const convexUser = useQuery(api.users.getCurrentUser);
  const isAdmin = convexUser?.role === "admin";
  const phoneNumber = "2349032212960"; // Put your number here
  const message = "Hello, CircuitIQ support! I have a question.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  // If Convex is still connecting, show a loading message
  if (convexUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    // min-h-[calc(100vh-64px)] accounts for your BottomNav height
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Profile Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Name
              </span>
              <span className="font-medium text-blue-600">
                {convexUser?.name === "unset"
                  ? "Syncing..."
                  : convexUser?.name || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </span>
              <span className="font-medium truncate max-w-[150px]">
                {convexUser?.email === "unset"
                  ? "Syncing..."
                  : convexUser?.email || "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Admin Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-blue-300 hover:bg-blue-100"
                onClick={() => navigate("/manage-questions")}
              >
                Manage Quiz Questions
              </Button>
            </CardContent>
          </Card>
        )}

        {/* This section changes based on Auth State */}
        <div className="space-y-3">
          <SignedIn>
            <Button
              variant="destructive"
              className="w-full flex items-center gap-2 py-6"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="w-full flex items-center gap-2 py-6">
                <LogIn className="w-4 h-4" />
                Sign In to Account
              </Button>
            </SignInButton>
          </SignedOut>
        </div>

        <p className="text-[12px] text-center text-muted-foreground px-6">
          Have you got any questions or feel that something isn't working right?
          please reach out to us at{" "}
          <a href={whatsappUrl} className="text-blue-600 hover:underline">
            support@circuitiq.com
          </a>
        </p>
      </div>
    </div>
  );
}

// import { useClerk } from "@clerk/clerk-react";
// import { useQuery } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import { Button } from "../../components/ui/button";
// import { LogOut, User, Mail, ShieldCheck } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

// export default function ProfilePage() {
//   const { signOut } = useClerk();
//   const convexUser = useQuery(api.users.getCurrentUser);

//   // If Convex is still connecting, show a loading message
//   if (convexUser === undefined) return <div>Loading profile...</div>;

//   return (
//     <div className="container max-w-2xl py-8 space-y-6">
//       <h1 className="text-3xl font-bold">Profile Settings</h1>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <User className="w-5 h-5" /> Account Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between border-b pb-2">
//             <span className="text-muted-foreground flex items-center gap-2">
//               <ShieldCheck className="w-4 h-4" /> Name in Database
//             </span>
//             <span className="font-medium text-blue-600">
//               {/* {convexUser?.name || "Loading..."} */}
//               {convexUser?.name === "unset"
//                 ? "Syncing..."
//                 : convexUser?.name || "Anonymous"}
//             </span>
//           </div>
//           <div className="flex items-center justify-between border-b pb-2">
//             <span className="text-muted-foreground flex items-center gap-2">
//               <Mail className="w-4 h-4" /> Email Address
//             </span>
//             <span className="font-medium">
//               {/* {convexUser?.email || "unset"} */}
//               {convexUser?.email === "unset"
//                 ? "Syncing..."
//                 : convexUser?.email || "Anonymous"}
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       <Button
//         variant="destructive"
//         className="w-full flex items-center gap-2"
//         onClick={() => signOut({ redirectUrl: "/" })}
//       >
//         <LogOut className="w-4 h-4" />
//         Sign Out & Refresh Session
//       </Button>

//       <p className="text-xs text-center text-muted-foreground">
//         Note: Signing out and back in will refresh your profile data from Clerk.
//       </p>
//     </div>
//   );
// }

// // CLERK_FRONTEND_API_URL=https://strong-haddock-56.clerk.accounts.dev
