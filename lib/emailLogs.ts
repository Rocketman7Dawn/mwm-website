// lib/emailLogs.ts
import { createClient } from "@supabase/supabase-js";
import type { DraftEmailInput, DraftEmailResult } from "@/lib/emailResponder";

// SERVER-ONLY: use service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type LogEmailDraftParams = {
  input: DraftEmailInput;
  result: DraftEmailResult;
  channel?: string;
  metadata?: any;
};

export async function logEmailDraft(params: LogEmailDraftParams) {
  const { input, result, channel = "email", metadata = null } = params;

  const { data, error } = await supabase.from("email_logs").insert({
    client_id: input.clientId,
    from_name: input.fromName ?? null,
    from_email: input.fromEmail ?? null,
    original_subject: input.originalSubject,
    original_body: input.originalBody,
    reply_subject: result.subject,
    reply_body: result.body,
    intent: result.intent,
    source: result.source,
    channel,
    metadata,
  }).select("id").single();

  if (error) {
    console.error("Error logging email draft:", error);
    return null;
  }

  return data?.id as string | null;
}
