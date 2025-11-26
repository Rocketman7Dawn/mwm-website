import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function GET() {
  // Use the same NextAuth session config as your main auth route
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  // You can expand this later to include role checks, etc.
  return NextResponse.json({
    ok: true,
    email: session.user.email,
  });
}
