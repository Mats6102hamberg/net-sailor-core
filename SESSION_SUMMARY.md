# Net Sailor Core – Session Summary

**Senaste uppdatering**: 2026-02-07 10:05 UTC+01:00  
**Status**: Live på Vercel, DB migrerad, alla checkpoints gröna

---

## Vad som ändrades (2026-02-07)

- Nytt projekt: Next.js 14, TypeScript, Tailwind, Prisma
- Superapp med två lägen: **Familj** (Net Sailor) + **Område** (Trygg Nära)
- `[locale]`-routing (sv/en, ar förberett)
- Boris-komponent med mood-system + BML-definition
- AI-router stub (`/api/ai/ask`)
- Prisma schema: 7 modeller (Guardian, Kid, Lesson, LessonTranslation, Area, AreaEvent, BorisLog)
- Ny databas `netsailorcore` skapad i Neon (separat från gamla `neondb`)
- Migration `20260207100321_init` körd
- Deployad till Vercel med GitHub-integration

---

## Env vars (Vercel + lokalt)

```
DATABASE_URL  # Neon Postgres → netsailorcore (pooler)
```

Framtida (ej satta ännu):
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_AI_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- `CAPTAIN_SESSION_SECRET`

---

## Git & Deploy

| Plats | Värde |
|-------|-------|
| Lokalt | `/Users/matshamberg/CascadeProjects/net-sailor-core/` |
| GitHub | `https://github.com/Mats6102hamberg/net-sailor-core` |
| Vercel | `https://net-sailor-core-mats-hambergs-projects.vercel.app` |
| Branch | `main` |
| Senaste commit | `98c9f4b` – Prisma migration init |
| DB | `netsailorcore` @ Neon (ep-small-mouse-agpsoekg) |

⚠️ **Deployment Protection** är aktivt – stäng av för Production i Vercel Settings → Deployment Protection.

---

## Checkpoints (2026-02-07 10:06)

- `npm run dev` ✅
- `npm run build` ✅
- `/sv` och `/en` ✅ (200)
- `/api/health` ✅ (200, JSON)
- DB-migration ✅ (`20260207100321_init`)

---

## Nästa steg

1. Stäng av Deployment Protection för Production
2. Implementera Clerk auth (Guardian-flöde)
3. Migrera Captain-logik från gamla Net Sailor
4. Bygga Trygg Nära MVP (områden, händelser)
5. Koppla Boris till riktig AI
