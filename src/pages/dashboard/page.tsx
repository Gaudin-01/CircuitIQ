// app/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import UsernameForm from "../../components/UsernameForm";

export default function Dashboard() {
  const user = useQuery(api.users.getCurrentUser);

  if (user === undefined) return <div>Loading...</div>;

  // If the user is logged in but hasn't picked a username yet
  if (user && !user.username) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <UsernameForm />
      </div>
    );
  }

  return (
    <main>
      <h1>Welcome back, {user?.username || user?.name}</h1>
      {/* Rest of your quiz app components */}
    </main>
  );
}
