// lib/emailAssist.ts
import {
  ClientEmailRecord,
  getRecentEmailsForClient,
} from "./getClientEmails";

export type EmailContext = {
  contextReady: boolean;
  contextText: string;
  emails: ClientEmailRecord[];
};

export async function getClientEmailContext(
  clientSlug: string,
  limit = 20
): Promise<EmailContext> {
  const emails = await getRecentEmailsForClient(clientSlug, limit);

  if (!emails.length) {
    return {
      contextReady: true,
      contextText: "No prior emails found for this client.",
      emails: [],
    };
  }

  const contextLines = emails.map((e) => {
    const date = e.received_at;
    const from = e.from_email ?? "unknown";
    const subject = e.subject ?? "";
    const body = (e.body_text ?? "").slice(0, 1200);

    return [
      "----- EMAIL -----",
      `Date: ${date}`,
      `From: ${from}`,
      `Subject: ${subject}`,
      "",
      body,
      "",
    ].join("\n");
  });

  const contextText = contextLines.join("\n");

  return {
    contextReady: true,
    contextText,
    emails,
  };
}
