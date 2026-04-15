import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api.js";
import { Loader2 } from "lucide-react"; // Using Lucide for a standard spinner
import { Button } from "../../components/ui/button.tsx";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const updateCurrentUser = useMutation(api.users.updateCurrentUser);

  useEffect(() => {
    const syncUser = async () => {
      // 1. Wait until Convex confirms the Clerk token is valid
      if (!isLoading && isAuthenticated) {
        try {
          // 2. Run your mutation to create/update the user in your database
          await updateCurrentUser();
          // 3. Redirect to the dashboard/home
          navigate("/", { replace: true });
        } catch (err) {
          console.error("Failed to sync user:", err);
        }
      } else if (!isLoading && !isAuthenticated) {
        // If loading finished but user isn't auth'd, send them home
        navigate("/", { replace: true });
      }
    };

    syncUser();
  }, [isLoading, isAuthenticated, updateCurrentUser, navigate]);

  // Error State: If something goes wrong during the transition
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-svh gap-6 px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-destructive font-medium">Authentication Failed</p>
          <p className="text-sm text-muted-foreground max-w-md">
            We couldn't verify your session. Please try logging in again.
          </p>
        </div>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    );
  }

  // Loading State: The "Waiting Room"
  return (
    <div className="flex flex-col items-center justify-center h-svh gap-4">
      <Loader2 className="size-8 animate-spin text-primary" />
      <div className="text-center">
        <p className="text-lg font-medium">Finalizing Connection</p>
        <p className="text-sm text-muted-foreground">
          Syncing your CircuitIQ profile...
        </p>
      </div>
    </div>
  );
}
