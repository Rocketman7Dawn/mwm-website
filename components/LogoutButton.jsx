"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={{
        padding: "0.35rem 0.75rem",
        borderRadius: 999,
        border: "1px solid #ffffff55",
        background: "transparent",
        color: "#ffffff",
        fontSize: "0.8rem",
        cursor: "pointer",
      }}
    >
      Log out
    </button>
  );
}
