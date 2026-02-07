# Net Sailor Core – Session Summary

**Senaste uppdatering**: 2026-02-07 12:15 UTC+01:00  
**Status**: Live på Vercel, Trygg Nära MVP + moderation v1, alla checkpoints gröna

---

## Vad som ändrades (2026-02-07)

### Session 1 – Grundprojekt
- Nytt projekt: Next.js 14, TypeScript, Tailwind, Prisma
- Superapp med två lägen: **Familj** (Net Sailor) + **Område** (Trygg Nära)
- `[locale]`-routing (sv/en, ar förberett)
- Boris-komponent med mood-system + BML-definition
- AI-router stub (`/api/ai/ask`)
- Ny databas `netsailorcore` i Neon (separat från gamla `neondb`)
- Deployad till Vercel med GitHub-integration

### Session 2 – Trygg Nära MVP
- Utvidgat Prisma schema: `EventType` + `EventStatus` enums, `reporterName`, `resolvedAt`
- Migration `20260207103258_add_event_enums`
- **Områdes-lista** (`/omrade`) – hämtar från DB, sökbar
- **Områdes-dashboard** (`/omrade/[slug]`) – händelselista med färgkodning per severity
- **Rapportera händelse** (`/omrade/[slug]/rapportera`) – formulär med typ, severity, beskrivning
- **API-routes**: `GET/POST /api/areas`, `GET/POST /api/areas/[slug]/events`
- **Komponenter**: `AreaList`, `EventCard`, `ReportForm`
- **Seed-data**: 5 Stockholms-områden + 5 demo-händelser
- i18n utvidgad med alla Trygg Nära-texter (sv + en)

### Session 3 – Moderation v1
- `EventStatus` enum utökad: `PENDING`, `APPROVED`, `REJECTED` (+ `RESOLVED`, `ARCHIVED`)
- Default status vid skapande: `PENDING`
- Migration `20260207115400_add_event_moderation`
- **Offentliga listor** visar bara `APPROVED` events
- **POST rapport** skapar alltid `PENDING`, returnerar `{ ok, status, eventId }`
- **Admin-endpoints** skyddade med `x-admin-key` header:
  - `GET /api/admin/events?status=PENDING` – lista pending
  - `PATCH /api/admin/events/[id]` – godkänn/avslå
- **Admin-sida** `/[locale]/omrade/admin` – granska, godkänn, avslå
- Ny komponent: `AdminPanel`
- i18n: admin-nycklar på sv + en
- Seed uppdaterad: alla demo-events har `status: APPROVED`

### Session 4 – Trygg Nära landningssida
- Ny sida: `/[locale]/trygg-nara` (sv + en)
- Sektioner: Hero med Pilot-badge, 3 informationskort, flödesrad (Rapport → Granskning → Godkänd → Synlig), Boris-meddelande, FAQ (4 frågor)
- CTA-knapp → `/[locale]/omrade`
- Meta title/description per locale
- Alla texter via i18n (`tryggNaraLanding.*`)
- Testa: `/sv/trygg-nara` och `/en/trygg-nara`

---

## Env vars (Vercel + lokalt)

```
DATABASE_URL  # Neon Postgres → netsailorcore (pooler)
ADMIN_KEY     # Admin-nyckel för moderation (x-admin-key header)
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
| Senaste commit | moderation v1 |
| DB | `netsailorcore` @ Neon (ep-small-mouse-agpsoekg) |

⚠️ **Deployment Protection** är aktivt – stäng av för Production i Vercel Settings → Deployment Protection.

---

## Checkpoints (2026-02-07 12:15)

- `npm run build` ✅ (20 routes)
- `/sv/omrade` visar bara APPROVED ✅
- POST rapport → skapar PENDING i DB ✅
- Admin utan nyckel → 401 ✅
- Admin med nyckel → visar PENDING ✅
- Godkänn → APPROVED, syns publikt ✅
- Avslå → REJECTED, syns INTE publikt ✅
- DB-migrationer ✅ (`init` + `add_event_enums` + `add_event_moderation`)

---

## Testa moderation lokalt

```bash
# Starta dev
npm run dev

# Skapa rapport (blir PENDING)
curl -X POST http://localhost:3000/api/areas/sodermalm/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","type":"INFO","severity":1}'

# Se pending (kräver ADMIN_KEY)
curl -H "x-admin-key: $ADMIN_KEY" "http://localhost:3000/api/admin/events?status=PENDING"

# Godkänn
curl -X PATCH http://localhost:3000/api/admin/events/<ID> \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{"status":"APPROVED"}'

# Eller använd admin-sidan: /sv/omrade/admin
```

---

## Nästa steg

1. Migrera Captain-logik från gamla Net Sailor
2. Koppla Boris till riktig AI
3. Clerk auth (senare, när allt fungerar)
