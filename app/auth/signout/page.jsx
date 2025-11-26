"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  const router = useRouter();

  const handleCancel = () => {
    // Just go back to whatever page they were on (their client dashboard)
    router.back();
  };

  const handleConfirm = async () => {
    // Fully sign out, then send them to the generic login screen
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <main className="min-h-screen text-slate-50">
      <div
        style={{
          maxWidth: "960px",
          margin: "3rem auto",
          padding: "2rem 2.5rem",
          borderRadius: "18px",
          background: "rgba(0, 0, 0, 0.7)",
          fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
          textAlign: "center",
        }}
      >
        <h1 className="mb-3 text-2xl font-semibold">Sign out</h1>
        <p className="mb-6 text-sm text-slate-200">
          Are you sure you want to sign out?
        </p>

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-slate-300/70 px-4 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-slate-900 hover:bg-white"
          >
            Yes, sign me out
          </button>
        </div>
      </div>
    </main>
  );
}
