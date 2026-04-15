import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    // Capture the role from the Clerk JWT (requires the JWT Template update)
    const role = (identity.role as string) || "student";

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    if (user !== null) {
      // Update if name, email, OR role has changed
      if (
        user.name !== identity.name ||
        user.email !== identity.email ||
        user.role !== identity.role
      ) {
        await ctx.db.patch(user._id, {
          name: identity.name,
          email: identity.email,
          role: role,
        });
      }
      return user._id;
    }

    // Create new user with the role included
    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous",
      email: identity.email ?? "No Email",
      tokenIdentifier: identity.tokenIdentifier,
      role: role ?? "student", // Default to 'student' if role is missing
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // Returning null instead of throwing stops the frontend from crashing
    // during the "handshake" phase of logging in.
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
  },
});

// import { ConvexError } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const updateCurrentUser = mutation({
//   // export const identity = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError({
//         code: "UNAUTHENTICATED",
//         message: "User not logged in",
//       });
//     }

//     // Check if we've already stored this identity before.
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();
//     if (user !== null) {
//       // If they exist but changed their name/email in Clerk, update Convex
//       if (user.name !== identity.name || user.email !== identity.email) {
//         await ctx.db.patch(user._id, {
//           name: identity.name,
//           email: identity.email,
//         });
//       }
//       return user._id;
//     }
//     // If it's a new identity, create a new User.
//     return await ctx.db.insert("users", {
//       name: identity.name,
//       email: identity.email,
//       tokenIdentifier: identity.tokenIdentifier,
//     });
//   },
// });

// export const getCurrentUser = query({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError({
//         code: "UNAUTHENTICATED",
//         message: "Called getCurrentUser without authentication present",
//       });
//     }
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();
//     return user;
//   },
// });

// // convex/users.ts
// import { mutation } from "./_generated/server";

// export const updateCurrentUser = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();

//     if (user !== null) {
//       // Logic to fix 'unset' or 'Anonymous' names
//       if (user.name !== identity.name || user.email !== identity.email) {
//         await ctx.db.patch(user._id, {
//           name: identity.name ?? "Anonymous",
//           email: identity.email,
//         });
//       }
//       return user._id;
//     }

//     return await ctx.db.insert("users", {
//       name: identity.name ?? "Anonymous",
//       email: identity.email,
//       tokenIdentifier: identity.tokenIdentifier,
//     });
//   },
// });

// import { mutation } from "./_generated/server";

// export const store = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();

//     if (user !== null) {
//       // FIX: If the stored name is 'anonymous' or 'unset', but the new token
//       // has a real name, patch the database record.
//       const shouldUpdate =
//         (user.name === "Anonymous" || user.name === "unset") &&
//         identity.name !== undefined;

//       if (shouldUpdate || user.email !== identity.email) {
//         await ctx.db.patch(user._id, {
//           name: identity.name ?? "Anonymous",
//           email: identity.email,
//         });
//       }
//       return user._id;
//     }

//     return await ctx.db.insert("users", {
//       name: identity.name ?? "Anonymous",
//       email: identity.email,
//       tokenIdentifier: identity.tokenIdentifier,
//     });
//   },
// });

// import { mutation } from "./_generated/server";

// export const store = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();

//     if (user !== null) {
//       // This part is CRUCIAL: It patches existing 'unset' users with the new Clerk data
//       if (user.name !== identity.name || user.email !== identity.email) {
//         await ctx.db.patch(user._id, {
//           name: identity.name ?? "Anonymous",
//           email: identity.email,
//         });
//       }
//       return user._id;
//     }

//     return await ctx.db.insert("users", {
//       name: identity.name ?? "Anonymous",
//       email: identity.email,
//       tokenIdentifier: identity.tokenIdentifier,
//     });
//   },
/////////});

// import { ConvexError } from "convex/values";
// import { mutation, query } from "./_generated/server";

// /**
//  * Syncs the Clerk user identity with the Convex "users" table.
//  * Renamed to 'store' to match the call in your App.tsx.
//  */
// export const store = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError({
//         code: "UNAUTHENTICATED",
//         message: "User not logged in",
//       });
//     }

//     // Check if the user already exists in our Convex database
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();

//     if (user !== null) {
//       // Update info if name or email changed in Clerk
//       if (user.name !== identity.name || user.email !== identity.email) {
//         await ctx.db.patch(user._id, {
//           name: identity.name ?? "Anonymous",
//           email: identity.email,
//         });
//       }
//       return user._id;
//     }

//     // New user: insert into the "users" table
//     return await ctx.db.insert("users", {
//       name: identity.name ?? "Anonymous",
//       email: identity.email,
//       tokenIdentifier: identity.tokenIdentifier,
//     });
//   },
// });

// export const getCurrentUser = query({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       return null; // Return null instead of throwing to avoid frontend crashes during loading
//     }

//     return await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();
//   },
// ////////});

// import { ConvexError } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const updateCurrentUser = mutation({
//   // export const identity = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError({
//         code: "UNAUTHENTICATED",
//         message: "User not logged in",
//       });
//     }

//     // Check if we've already stored this identity before.
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();
//     if (user !== null) {
//       // If they exist but changed their name/email in Clerk, update Convex
//       if (user.name !== identity.name || user.email !== identity.email) {
//         await ctx.db.patch(user._id, {
//           name: identity.name,
//           email: identity.email,
//         });
//       }
//       return user._id;
//     }
//     // If it's a new identity, create a new User.
//     return await ctx.db.insert("users", {
//       name: identity.name,
//       email: identity.email,
//       tokenIdentifier: identity.tokenIdentifier,
//     });
//   },
// });

// export const getCurrentUser = query({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) {
//       throw new ConvexError({
//         code: "UNAUTHENTICATED",
//         message: "Called getCurrentUser without authentication present",
//       });
//     }
//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();
//     return user;
//   },
// });

// export const store = mutation({
//   args: {},
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return null;

//     const user = await ctx.db
//       .query("users")
//       .withIndex("by_token", (q) =>
//         q.eq("tokenIdentifier", identity.tokenIdentifier),
//       )
//       .unique();

//     if (user !== null) return user._id;

//     return await ctx.db.insert("users", {
//       tokenIdentifier: identity.tokenIdentifier,
//       name: identity.name,
//       email: identity.email,
//     });
//   },
// });
