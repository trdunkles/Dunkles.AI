# Dunkles

Görselle sohbet arayüzü: prompt kutusu + görsel yükleme (dosya seç, sürükle-bırak, yapıştır).

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · lucide-react

## Kurulum

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY değerini gir
npm run dev
```

http://localhost:3000

## Yapı

- `components/metal-prompt-bar.tsx` – 21st.dev MetalPromptBar (metal-fx), görsel yükleme eklendi
- `components/use-surface-theme.ts` – tema hook'u
- `components/chat.tsx` – sohbet ekranı
- `components/logo.tsx` – beyaz Dunkles logosu (vektör)
- `app/api/chat/route.ts` – görselli mesajları Claude'a gönderen API

## 21st.dev bileşenleri

```bash
npx shadcn@latest init
npx shadcn@latest add "<21st.dev bileşen linki>"
```
