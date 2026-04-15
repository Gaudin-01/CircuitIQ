export default {
  providers: [
    {
      // Ensure this matches the Issuer URL from Clerk exactly
      domain: "https://strong-haddock-56.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ],
};

// export default {
//   providers: [
//     {
//       // Replace with your actual Clerk issuer URL from your Clerk dashboard
//       // domain: "https://your-issuer-url.clerk.accounts.dev/",
//       domain: "https://strong-haddock-56.clerk.accounts.dev/",

//       applicationID: "convex",
//     },
//   ],
// };
