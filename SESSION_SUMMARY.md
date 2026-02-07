# Net Sailor Core – Session Summary

**Senaste uppdatering**: 2026-02-07 14:05 UTC+01:00  
**Status**: Live på Vercel, Trygg Nära MVP + moderation v1 + landningssida + förebyggande moderation

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

### Session 5 – Förebyggande moderation + admin-förbättringar
- **Regelruta i rapportflödet** (Prio 1): Användaren måste klicka "Jag förstår – gå vidare" innan formuläret visas. Regler: fokus på platser, inga personanklagelser, beskriv konkret, 112 vid akut.
- **CSV-export i admin** (Prio 2b): Knapp "Exportera som CSV" – laddar ner fil med Område, Typ, Severity, Datum, Titel, Beskrivning, Status.
- **Tack-sida med förväntan** (Prio 3): Efter inskickad rapport: "Vanligtvis inom 24–48 timmar."
- **"Om piloten"-ruta** (Prio 4): På landningssidan `/trygg-nara` – professionell text för kommun/akademi.
- **Dashboard-förbättringar**: Granskad-note, typfärger (amber/blå/grön/lila), Godkänd-badge, "Rapportera i [område]"-knapp.
- PENDING sorteras redan nyast först i admin API (Prio 2a – redan korrekt).
- i18n: alla nya nycklar sv + en

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
| Senaste commit | `a240238` – Prio 1-4: regelruta, CSV-export, tack-sida, Om piloten |
| DB | `netsailorcore` @ Neon (ep-small-mouse-agpsoekg) |

⚠️ **Deployment Protection** är aktivt – stäng av för Production i Vercel Settings → Deployment Protection.

---

## Checkpoints (2026-02-07 14:05)

- `npm run build` ✅ (22 routes)
- `/sv/omrade` visar bara APPROVED ✅
- POST rapport → skapar PENDING i DB ✅
- Admin utan nyckel → 401 ✅
- Admin med nyckel → visar PENDING (nyast först) ✅
- Godkänn → APPROVED, syns publikt ✅
- Avslå → REJECTED, syns INTE publikt ✅
- DB-migrationer ✅ (`init` + `add_event_enums` + `add_event_moderation`)
- Regelruta visas innan rapportformulär ✅
- CSV-export i admin ✅
- Tack-sida med 24–48h förväntan ✅
- Landningssida `/sv/trygg-nara` + `/en/trygg-nara` ✅
- "Om piloten"-ruta på landningssidan ✅

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

## Viktiga länkar

| Vad | URL |
|-----|-----|
| **Lokal dev** | `http://localhost:3000` |
| **Landningssida (sv)** | `http://localhost:3000/sv/trygg-nara` |
| **Landningssida (en)** | `http://localhost:3000/en/trygg-nara` |
| **Område (sv)** | `http://localhost:3000/sv/omrade` |
| **Dashboard Södermalm** | `http://localhost:3000/sv/omrade/sodermalm` |
| **Rapportera** | `http://localhost:3000/sv/omrade/sodermalm/rapportera` |
| **Admin** | `http://localhost:3000/sv/omrade/admin` |
| **GitHub** | `https://github.com/Mats6102hamberg/net-sailor-core` |
| **Vercel (prod)** | `https://net-sailor-core-mats-hambergs-projects.vercel.app` |
| **Vercel landningssida** | `https://net-sailor-core-mats-hambergs-projects.vercel.app/sv/trygg-nara` |

---

## Nästa steg

1. Migrera Captain-logik från gamla Net Sailor
2. Koppla Boris till riktig AI
3. Clerk auth (senare, när allt fungerar)
4. Statistiksektion på landningssidan (när det finns riktiga användare)
5. Boris som dirigent (arkitekturbeslut: GPT-5.3 vs Claude vs Gemini vs embeddings)

---

## Teknisk bedömning – Trygg Nära (2026-02-07)

### Styrkor

- **Tydligt syfte** – Trygg Nära löser ett verkligt problem: lokal trygghet utan att bli en "häng ut"-plattform. Regelrutan och granskningen visar att etiken är genomtänkt från start.
- **Moderationsflödet** – PENDING → APPROVED/REJECTED är rätt arkitektur. Många appar missar detta och får problem senare. Här finns det från dag 1.
- **Kommunvänligt** – CSV-export, "Om piloten"-rutan, saklig ton – det här är saker som gör att en kommun faktiskt vågar testa. Professorer och bidragsgivare kommer uppskatta det.
- **Tvåspråkigt från start** – i18n med sv/en genomgående. Lätt att lägga till fler språk.
- **Ren kodstruktur** – Next.js App Router, Prisma, Tailwind, tydlig mappstruktur. Lätt att onboarda en ny utvecklare.

### Svagheter / risker att adressera

- **Ingen autentisering ännu** – Admin skyddas bara av en delad nyckel i header. Funkar för pilot, men behöver Clerk/auth innan riktig drift.
- **Ingen rate limiting** – Någon kan spamma rapporter. Bör läggas till innan publik lansering.
- **Boris är fortfarande stub** – Den stora visionen med AI-dirigent finns inte ännu. Det är okej för pilot, men det är där den riktiga differentieringen ligger.
- **Ingen notifiering** – Admin vet inte att det finns nya rapporter att granska. En enkel webhook/e-post skulle göra stor skillnad.
- **Mobilupplevelsen** – Tailwind hanterar responsivitet, men appen borde testas ordentligt på mobil – det är där de flesta användare kommer vara.

### Sammanfattning

Som **pilot** är appen stark. Den gör rätt saker: granskning, saklig ton, inga personanklagelser, tvåspråkig, exporterbar data. Det är en app som faktiskt går att visa för en kommun utan att skämmas. Nästa stora steg är att få **riktiga användare** i ett område och se vad som händer. Tekniken är redo – nu handlar det om adoption.
