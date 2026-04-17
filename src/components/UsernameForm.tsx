// components/UsernameForm.tsx
"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UsernameForm() {
  const [username, setUsernameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setUsername = useMutation(api.users.setUsername);

  // 1. Fetch data from Convex
  const isTaken = useQuery(api.users.checkUsername, {
    username: username.length >= 3 ? username.toLowerCase() : "",
  });

  // 2. DERIVED STATE (No useEffect needed!)
  // This calculates every time the component renders
  const isLoadingQuery = username.length >= 3 && isTaken === undefined;

  let isAvailable = null;
  if (username.length >= 3 && isTaken !== undefined) {
    isAvailable = !isTaken;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await setUsername({ username: username.toLowerCase().trim() });
      window.location.reload();
    } catch (err) {
      console.error("Error setting username:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-primary/3 rounded-xl shadow-2xl border border-gray-600 max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-100 mb-2">
        Create a Username
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter username (min 3 chars)"
            className={`w-full p-4 border rounded-lg  outline-none transition-all ${
              isAvailable === true
                ? "border-green-500"
                : isAvailable === false
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 focus:border-blue-500"
            }`}
            value={username}
            onChange={(e) =>
              setUsernameInput(e.target.value.replace(/\s+/g, ""))
            }
          />
          {isLoadingQuery && (
            <div className="absolute right-4 top-4 animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          )}
        </div>

        <div className="h-6 mt-2">
          {username.length > 0 && username.length < 3 && (
            <p className="text-xs text-amber-600">
              Username must be at least 3 characters.
            </p>
          )}
          {isAvailable === false && !isLoadingQuery && (
            <p className="text-xs text-red-500 font-medium">
              ❌ This username is already taken.
            </p>
          )}
          {isAvailable === true && !isLoadingQuery && (
            <p className="text-xs text-green-600 font-medium">
              ✅ Username is available!
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isAvailable || isSubmitting || isLoadingQuery}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors disabled:bg-gray-300 shadow-lg"
        >
          {isSubmitting ? "Saving..." : "Join the Leaderboard"}
        </button>
      </form>
    </div>
  );
}
