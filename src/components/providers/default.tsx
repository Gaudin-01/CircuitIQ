import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { QueryClientProvider } from "./query-client.tsx";
import { ThemeProvider } from "./theme.tsx";
import { Toaster } from "../ui/sonner.tsx";
import { TooltipProvider } from "../ui/tooltip.tsx";

// This explicitly connects your app to your Convex database!
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export function DefaultProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      <QueryClientProvider>
        <TooltipProvider>
          <ThemeProvider>
            <Toaster />
            {children}
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ConvexAuthProvider>
  );
}

// import { QueryClientProvider } from "./query-client.tsx";
// import { ThemeProvider } from "./theme.tsx";
// import { Toaster } from "../ui/sonner.tsx";
// import { TooltipProvider } from "../ui/tooltip.tsx";

// export function DefaultProviders({ children }: { children: React.ReactNode }) {
//   return (
//     <QueryClientProvider>
//       <TooltipProvider>
//         <ThemeProvider>
//           <Toaster />
//           {children}
//         </ThemeProvider>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }
