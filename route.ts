import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type ImageIn = { mediaType: string; data: string };
type MessageIn = { role: "user" | "assistant"; text: string; images?: ImageIn[] };

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const SYSTEM =
  "Sen Dunkles'in asistanısın. Kullanıcı seninle metin ve görsellerle sohbet eder. " +
  "Görselleri dikkatle incele, net ve kısa yanıt ver. Kullanıcı hangi dilde yazıyorsa o dilde cevap ver.";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY tanımlı değil (.env.local)." }, { status: 500 });
  }

  let body: { messages?: MessageIn[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (!messages.length) return Response.json({ error: "Mesaj yok." }, { status: 400 });

  const payload = messages.map((m) => ({
    role: m.role,
    content: [
      ...(m.images ?? [])
        .filter((i) => ALLOWED.includes(i.mediaType))
        .map((i) => ({
          type: "image",
          source: { type: "base64", media_type: i.mediaType, data: i.data },
        })),
      { type: "text", text: m.text?.trim() || "(görsel)" },
    ],
  }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 1500,
      system: SYSTEM,
      messages: payload,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json({ error: data?.error?.message ?? "API hatası." }, { status: res.status });
  }

  const text = (data.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n");

  return Response.json({ text });
}
