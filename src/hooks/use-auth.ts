import { useClerk, useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useCallback } from "react";

export function useAuth() {
  const { openSignIn, signOut } = useClerk();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } =
    useConvexAuth();

  // If Clerk says we have a user, we treat the app as authenticated
  // even if Convex is still "thinking" (handshaking).
  const isAuthenticated = isConvexAuthenticated || !!user;

  const signinRedirect = useCallback(async () => {
    if (isAuthenticated) return; // Guard: Don't open modal if already auth'd
    return openSignIn({
      afterSignInUrl: "/auth/callback",
      afterSignUpUrl: "/auth/callback",
    });
  }, [openSignIn, isAuthenticated]);

  const removeUser = useCallback(async () => {
    return signOut({ redirectUrl: window.location.origin });
  }, [signOut]);

  return {
    isAuthenticated,
    isLoading: isConvexLoading || !isUserLoaded,
    user,
    signinRedirect,
    removeUser,
  };
}

// import { useClerk, useUser } from "@clerk/clerk-react";
// import { useConvexAuth } from "convex/react";
// import { useCallback } from "react";

// export function useAuth() {
//   const { openSignIn, signOut } = useClerk();
//   const { user, isLoaded: isUserLoaded } = useUser(); // Add isLoaded
//   const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();

//   const signinRedirect = useCallback(async () => {
//     return openSignIn({
//       afterSignInUrl: "/auth/callback",
//       afterSignUpUrl: "/auth/callback",
//     });
//   }, [openSignIn]);

//   const removeUser = useCallback(async () => {
//     return signOut();
//   }, [signOut]);

//   return {
//     isAuthenticated,
//     isLoading: isConvexLoading || !isUserLoaded, // Stay in loading state until BOTH are ready
//     user,
//     signinRedirect,
//     removeUser,
//   };
// }

// import { useClerk, useUser } from "@clerk/clerk-react";
// import { useConvexAuth } from "convex/react";
// import { useCallback } from "react";

// export function useAuth() {
//   const { openSignIn, signOut } = useClerk();
//   const { user } = useUser();
//   const { isAuthenticated, isLoading } = useConvexAuth();

//   const signinRedirect = useCallback(async () => {
//     // This is the function the button was looking for!
//     return openSignIn({
//       afterSignInUrl: "/auth/callback",
//       afterSignUpUrl: "/auth/callback",
//     });
//   }, [openSignIn]);

//   const removeUser = useCallback(async () => {
//     return signOut();
//   }, [signOut]);

//   return {
//     isAuthenticated,
//     isLoading,
//     user,
//     signinRedirect, // Now it is a function
//     removeUser,
//   };
// }
