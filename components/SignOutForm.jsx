// components/SignOutForm.jsx
"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SignOutForm({ callbackUrl = "/" }) {
  const router = useRouter();

  const handleBack = (e) => {
    e.preventDefault();
    if (callbackUrl && callbackUrl !== "/") {
      router.push(callbackUrl);
    } else {
      // Fallback: just go back in history if we don't have a specific URL
      router.back();
    }
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut({
      callbackUrl: "/auth/signin", // after sign out, go to login
    });
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center rounded-full border border-slate-500 bg-transparent px-5 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800"
      >
        Go back
      </button>

      {/* Confirm sign out */}
      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex items-center rounded-full bg-white/90 px-5 py-2 text-xs font-medium text-slate-900 hover:bg-white"
      >
        Yes, sign me out
      </button>
    </div>
  );
}
