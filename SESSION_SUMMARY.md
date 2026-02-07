# Net Sailor Core – Session Summary

**Projekt**: Net Sailor Core (Superapp)  
**Senaste uppdatering**: 2026-02-07  
**Status**: Grundprojekt skapat, bygger utan fel, pushat till GitHub

---

## Översikt

Net Sailor Core är en superapp med två lägen:
- **Familj** (Net Sailor) – Digital säkerhet för barn och föräldrar
- **Område** (Trygg Nära) – Lokal trygghet och grannsamverkan

En app. Två världar. En Boris 🐙.

---

## Vad som implementerades (2026-02-07)

### 1. Projektstruktur
- Next.js 14 med App Router, TypeScript, Tailwind CSS
- `[locale]`-routing med middleware (auto-redirect till `/sv/`)
- Prisma + Neon Postgres (schema klart, migration ej körd – behöver DATABASE_URL)

### 2. Språkstöd (i18n)
- **sv.json** – Svenska (komplett)
- **en.json** – Engelska (komplett)
- **ar.json** – Arabiska (komplett, RTL-stöd förberett i layout)
- Server-side `t(locale, key)` med nested key-support och fallback

### 3. Boris 🐙
- `Boris.tsx` – Server Component med mood-system (happy/encourage/warn/safety)
- `bml-core.json` – Boris MicroLanguage-definition med regler, fraser, triggers och context-modes
- Visas på startsidan och captain-sidan

### 4. AI-router
- `src/ai/router.ts` – Stub-implementation med provider-routing (openai/anthropic/gemini/stub)
- `/api/ai/ask` – POST-endpoint som returnerar Boris-svar baserat på locale
- `/api/health` – GET-endpoint för Vercel-ping

### 5. Prisma Schema (7 modeller)
- **Guardian** – Föräldrakonto (Clerk-redo)
- **Kid** – Barnprofil med PIN + status
- **Lesson** + **LessonTranslation** – Lektioner med i18n
- **Area** + **AreaEvent** – Områden och händelser (Trygg Nära)
- **BorisLog** – Loggning av Boris-konversationer

### 6. UI
- Startsida med Boris-hälsning + två kort (Familj / Område)
- Familj-sida med Captain/Guardian-val
- Captain-sida (placeholder med Boris)
- Guardian-sida (placeholder)
- Område-sida med "Kommer snart" + preview-features
- LanguageSwitcher-komponent (SV/EN)
- Ocean-tema med anpassade animationer (fade-in, bounce-slow, slide-up)

---

## Filer (alla nya)

```
net-sailor-core/
├── .env.example                              # Env-referens
├── .gitignore                                # Uppdaterad med .env
├── vercel.json                               # Build: prisma generate + next build
├── tailwind.config.ts                        # Ocean-tema + animationer
├── prisma/
│   └── schema.prisma                         # 7 modeller, 2 enums
├── src/
│   ├── middleware.ts                         # Locale-redirect
│   ├── app/
│   │   ├── layout.tsx                        # Root layout (passthrough)
│   │   ├── globals.css                       # Tailwind base
│   │   ├── [locale]/
│   │   │   ├── layout.tsx                    # Locale-aware layout med RTL-stöd
│   │   │   ├── page.tsx                      # Startsida: Familj / Område
│   │   │   ├── familj/
│   │   │   │   ├── page.tsx                  # Captain / Guardian-val
│   │   │   │   ├── captain/page.tsx          # Captain placeholder
│   │   │   │   └── guardian/page.tsx         # Guardian placeholder
│   │   │   └── omrade/
│   │   │       └── page.tsx                  # Trygg Nära placeholder
│   │   └── api/
│   │       ├── ai/ask/route.ts               # Boris AI stub-endpoint
│   │       └── health/route.ts               # Health check
│   ├── components/
│   │   ├── boris/Boris.tsx                   # Boris med mood-system
│   │   └── ui/LanguageSwitcher.tsx           # Språkväxlare
│   ├── i18n/
│   │   ├── config.ts                         # Locale-lista + helpers
│   │   ├── server.ts                         # Server-side t() + cache
│   │   └── locales/
│   │       ├── sv.json                       # Svenska
│   │       ├── en.json                       # Engelska
│   │       └── ar.json                       # Arabiska (redo)
│   ├── bml/
│   │   └── bml-core.json                    # Boris MicroLanguage
│   ├── ai/
│   │   ├── router.ts                         # AI-router med stub
│   │   ├── providers/.gitkeep                # Framtida providers
│   │   └── policies/.gitkeep                 # Framtida safety policies
│   └── lib/
│       ├── db/prisma.ts                      # Prisma singleton
│       ├── auth/.gitkeep                     # Framtida auth (Clerk)
│       └── safety/.gitkeep                   # Framtida safety-logik
```

---

## Routes

| Route | Typ | Beskrivning |
|-------|-----|-------------|
| `/` | Redirect | → `/{locale}/` |
| `/{locale}/` | SSG | Startsida med Familj/Område-val |
| `/{locale}/familj` | SSG | Captain/Guardian-val |
| `/{locale}/familj/captain` | SSG | Captain placeholder |
| `/{locale}/familj/guardian` | SSG | Guardian placeholder |
| `/{locale}/omrade` | SSG | Trygg Nära placeholder |
| `/api/ai/ask` | Dynamic | Boris AI-endpoint (POST) |
| `/api/health` | Static | Health check |

---

## Teknisk Stack

- **Framework**: Next.js 14 (App Router)
- **Språk**: TypeScript
- **Styling**: Tailwind CSS (ocean theme)
- **ORM**: Prisma
- **Databas**: Neon Postgres (ej ansluten ännu)
- **Auth**: Clerk (steg 2)
- **AI**: Stub-router (steg 2+)
- **i18n**: sv + en (ar redo)

---

## Environment Variables

```env
# Neon Postgres (KRÄVS)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# AI Keys (steg 2+)
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GOOGLE_AI_KEY=...

# Clerk Auth (steg 2)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...

# Captain Session (steg 2)
# CAPTAIN_SESSION_SECRET=super-secret-string
```

---

## Git & Deploy

**Lokalt**: `/Users/matshamberg/CascadeProjects/net-sailor-core/`  
**GitHub**: `https://github.com/Mats6102hamberg/net-sailor-core`  
**Branch**: `main`  
**Senaste commit**: `6fa2b5b` – "Initial: Net Sailor Core superapp med Familj + Område, Boris BML, i18n (sv/en/ar), Prisma schema, AI-router stub"  
**Vercel**: Ej deployad ännu (behöver kopplas)

---

## Nästa Steg

1. **Koppla Vercel** till `net-sailor-core` GitHub-repo
2. **Sätt DATABASE_URL** i Vercel env vars (Neon Postgres)
3. **Kör `npx prisma migrate dev`** lokalt med riktig DB
4. **Implementera Clerk auth** (Guardian-flöde)
5. **Migrera Captain-logik** från gamla Net Sailor
6. **Bygga Trygg Nära-features** (områden, händelser, grannsamverkan)
7. **Koppla Boris till riktig AI** (OpenAI/Anthropic/Gemini)

---

## Vad som INTE gjordes (och varför)

- **Clerk auth** – Mats beslutade att vänta till steg 2
- **Databas-migration** – Kräver riktig DATABASE_URL (Neon Postgres)
- **Seed data** – Väntar på att DB är ansluten
- **RTL-styling** – ar.json finns men RTL-CSS behöver testas
- **Captain/Guardian-funktionalitet** – Placeholder-sidor, migreras i steg 2

---

## Risker / Begränsningar

- Appen bygger utan DB-anslutning (Prisma generate fungerar, men inga queries)
- Gamla Net Sailor (`/Users/matshamberg/CascadeProjects/net-sailor/`) finns kvar – behöver beslutas om den ska arkiveras
- Vercel-deploy behöver manuell koppling
