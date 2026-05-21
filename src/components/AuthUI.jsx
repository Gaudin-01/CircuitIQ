import { useAuthActions } from "@convex-dev/auth/react";

export function SignInButton() {
  const { signIn } = useAuthActions();

  return (
    <button
      className="btn-google-login" // Style this with your CSS!
      onClick={() => void signIn("google")}
    >
      Sign in with Google
    </button>
  );
}

export function SignOutButton() {
  const { signOut } = useAuthActions();

  return (
    <button className="btn-logout" onClick={() => void signOut()}>
      Sign Out
    </button>
  );
}
