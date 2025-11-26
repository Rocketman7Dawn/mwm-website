"use client";

import React, { useState } from "react";

type ChatMessage = {
  id: number;
  from: "user" | "assistant";
  text: string;
  meta?: {
    intent?: string;
    source?: string;
  };
};

export default function GenericChatTestPage() {
  const [clientId, setClientId] = useState("mwp");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmedMessage = input.trim();
    const trimmedClientId = clientId.trim();

    if (!trimmedMessage || !trimmedClientId) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      from: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: trimmedClientId,
          message: trimmedMessage,
          channel: "web_chat",
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || "Request failed");
      }

      const data = await res.json();

      const assistantText: string =
        data.answer ?? "(No answer returned from /api/chat)";

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        from: "assistant",
        text: assistantText,
        meta: {
          intent: data.intent,
          source: data.source,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong talking to /api/chat");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-950 text-slate-100 px-4 py-8">
      <div className="w-full max-w-2xl space-y-4">
        <header className="border border-slate-800 rounded-2xl p-4 bg-slate-900/70">
          <h1 className="text-xl font-semibold">
            Generic Chat Test{" "}
            <span className="text-xs font-normal text-slate-400">
              (dev only)
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Send messages to{" "}
            <code className="px-1 py-0.5 rounded bg-slate-800 text-xs">
              /api/chat
            </code>{" "}
            for any client. The backend decides whether to use the FAQ or Zoom
            brain.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <label className="text-xs text-slate-300">
              Client ID
              <input
                className="mt-1 block rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1 text-sm font-mono outline-none focus:border-sky-500"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="e.g. mwp"
              />
            </label>
          </div>
        </header>

        <main className="border border-slate-800 rounded-2xl p-4 bg-slate-900/70 flex flex-col gap-4">
          <div className="h-80 overflow-y-auto space-y-3 pr-2 border border-slate-800 rounded-xl px-3 py-2 bg-slate-950/60">
            {messages.length === 0 && (
              <p className="text-sm text-slate-500">
                Set a{" "}
                <span className="font-mono text-sky-300">clientId</span> above
                (for example <span className="font-mono">mwp</span>), then try:
                <br />
                <span className="italic">
                  "What is the Mayan Wisdom Journey and how much does it cost?"
                </span>{" "}
                (FAQ)
                <br />
                or
                <br />
                <span className="italic">
                  "What is the Zoom link for the next online event?"
                </span>{" "}
                (Zoom).
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.from === "assistant" && m.meta && (
                    <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                      intent: {m.meta.intent ?? "?"} · source:{" "}
                      {m.meta.source ?? "?"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm outline-none focus:border-sky-500"
              placeholder="Ask a question as if you were a client’s customer…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || !clientId.trim()}
            />
            <button
              type="submit"
              disabled={isLoading || !clientId.trim()}
              className="rounded-xl px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Thinking…" : "Send"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl px-3 py-2 text-xs border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Clear
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
