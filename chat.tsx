"use client";

import * as React from "react";
import { MetalPromptBar, type AttachedImage } from "@/components/metal-prompt-bar";
import { Logo } from "@/components/logo";
import { cn } from "@/components/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  images?: AttachedImage[];
  error?: boolean;
};

const SUGGESTIONS = [
  "Bu görselde ne var?",
  "Görseldeki metni çıkar",
  "Bu tasarımı eleştir",
  "Bu görseli kısaca özetle",
];

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string, images: AttachedImage[]) {
    if (loading || (!text.trim() && images.length === 0)) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: text.trim(), images };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.error)
            .map((m) => ({
              role: m.role,
              text: m.text,
              images: m.images?.map((i) => ({ mediaType: i.mediaType, data: i.data })),
            })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Bir hata oluştu.");
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: json.text }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: e instanceof Error ? e.message : "Bir hata oluştu.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const promptBox = (
    <MetalPromptBar
      theme="dark"
      value={input}
      onValueChange={setInput}
      onSubmit={send}
      disabled={loading}
    />
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center gap-2.5 px-5 py-4">
        <Logo className="h-6 w-6" />
        <span className="text-[15px] font-semibold tracking-tight">Dunkles</span>
      </header>

      {messages.length === 0 ? (
        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
          <Logo className="mb-6 h-14 w-14" />
          <h1 className="mb-8 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Bugün neyi inceleyelim?
          </h1>
          <div className="w-full max-w-2xl">
            {promptBox}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted transition hover:border-white/30 hover:text-white"
                >
                  {s}
                </button>
              ))}
                    <div className="flex flex-wrap justify-end gap-2">
                      {m.images.map((img) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={img.id}
                          src={img.preview}
                          alt="Yüklenen görsel"
                          className="max-h-56 rounded-2xl border border-border object-cover"
                        />
                      ))}
                    </div>
                  )}
                  {m.text && (
                    <div
                      className={cn(
                        "max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-2.5 text-[15px] leading-6",
                        m.role === "user"
                          ? "bg-white text-black"
                          : m.error
                          ? "border border-red-500/40 text-red-300"
                          : "text-white"
                      )}
                    >
                      {m.text}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Logo className="h-4 w-4 animate-spin" />
                  Düşünüyor…
                </div>
              )}
              <div ref={endRef} />
            </div>
          </main>
          <footer className="mx-auto w-full max-w-2xl px-4 pb-4 pt-2">{promptBox}</footer>
        </>
      )}
    </div>
  );
        }
