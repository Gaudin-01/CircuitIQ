import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api"; // Adjust this path if your file structure requires it
import { useCallback } from "react";

export function useAuth() {
  const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();

  // Fetch the current user directly from your Convex database
  const user = useQuery(api.users.getCurrentUser);

  const signinRedirect = useCallback(async () => {
    if (isAuthenticated) return;
    // Trigger the native Convex Google login flow
    return signIn("google");
  }, [isAuthenticated, signIn]);

  const removeUser = useCallback(async () => {
    return signOut();
  }, [signOut]);

  return {
    isAuthenticated,
    // Ensure we are loading if Convex is checking state, or if we are auth'd but haven't fetched the user doc yet
    isLoading: isConvexLoading || (isAuthenticated && user === undefined),
    user,
    signinRedirect,
    removeUser,
  };
}
