import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  // Add this callbacks block to explicitly allow your mobile app scheme!
  callbacks: {
    async redirect({ redirectTo }) {
      // 1. Allow our custom mobile app scheme
      if (redirectTo === "com.circuitiq.app://callback") {
        return redirectTo;
      }
      // 2. Safely fallback to the default web URL (Vercel/Localhost)
      return process.env.SITE_URL as string;
    },
  },
});

// import { convexAuth } from "@convex-dev/auth/server";
// import Google from "@auth/core/providers/google";
// import {Password} from "@convex-dev/auth/providers/Password"; // Include this if you want standard email/password!

// export default convexAuth({
//   providers: [Google, Password],
// });

// export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
//   providers: [
//     Google({
//       // The profile callback lets us customize the data saved to the database upon registration
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name,
//           email: profile.email,
//           image: profile.picture
//         };
//       },
//     }),
//   ],
// });

// //  export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
// //    providers: [Google],
// //  });
