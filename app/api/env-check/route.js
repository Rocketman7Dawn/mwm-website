import { NextResponse } from "next/server";

export function GET() {
  const present = (k) => !!process.env[k];
  return NextResponse.json({
    NEXTAUTH_SECRET: present("NEXTAUTH_SECRET"),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || null,
    SUPABASE_URL: present("SUPABASE_URL"),
    SUPABASE_ANON_KEY: present("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: present("SUPABASE_SERVICE_ROLE_KEY"),
    MAILGUN_API_KEY: present("MAILGUN_API_KEY"),
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || null,
    MAILGUN_BASE_URL: process.env.MAILGUN_BASE_URL || null,
    ZOOM_WEBHOOK_SECRET: present("ZOOM_WEBHOOK_SECRET"),
    ENABLE_CHAT_AUTOMATION: process.env.ENABLE_CHAT_AUTOMATION || null,
  });
}
