
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.",
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{children}</ClerkProvider>
  );
}




// import { HerculesAuthProvider } from "@usehercules/auth/react";

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <HerculesAuthProvider
//       authority={import.meta.env.VITE_HERCULES_OIDC_AUTHORITY!}
//       client_id={import.meta.env.VITE_HERCULES_OIDC_CLIENT_ID!}
//       userManagerSettings={{
//         prompt: import.meta.env.VITE_HERCULES_OIDC_PROMPT ?? "select_account",
//         response_type:
//           import.meta.env.VITE_HERCULES_OIDC_RESPONSE_TYPE ?? "code",
//         scope:
//           import.meta.env.VITE_HERCULES_OIDC_SCOPE ??
//           "openid profile email offline_access",
//         redirect_uri:
//           import.meta.env.VITE_HERCULES_OIDC_REDIRECT_URI ??
//           `${window.location.origin}/auth/callback`,
//       }}
//     >
//       {children}
//     </HerculesAuthProvider>
//   );
// }
