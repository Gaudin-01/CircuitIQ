import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import {Password} from "@convex-dev/auth/providers/Password"; // Include this if you want standard email/password!

export default convexAuth({
  providers: [Google, Password],
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      // The profile callback lets us customize the data saved to the database upon registration
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture
        };
      },
    }),
  ],
});

//  export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
//    providers: [Google],
//  });

