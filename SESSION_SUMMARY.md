# Net Sailor Core – Session Summary

**Senaste uppdatering**: 2026-02-09 12:00 UTC+01:00
**Status**: Live på Vercel, Trygg Nära MVP + Captain/Familj + gemensam AppShell + QA-härdning

---

## Vad som ändrades

### Session 1–5 (2026-02-07)
- Se git-historik: grundprojekt, Trygg Nära MVP, moderation, landningssida, förebyggande moderation

### Session 6 – Captain/Familj (2026-02-09)
- Prisma: QuizQuestion, QuizQuestionTranslation, QuizAttempt modeller
- Kid: locale-fält, onDelete Cascade, quiz-relation
- Seed: 5 lektioner med quiz-frågor (sv + en), demo guardian + 2 barn
- Captain login: profilval + PIN (bcryptjs)
- Captain home: lektionslista med progress
- Lektionssidor: markdown-rendering + quiz
- Guardian dashboard: barnöversikt
- Nya komponenter: CaptainLoginForm, QuizForm, MarkdownRenderer, GuardianPanel
- Session-hantering för Captain (cookie-baserad)
- i18n: alla captain/guardian-texter (sv + en)

### Session 7 – Gemensam AppShell (2026-02-09)
- AppShell/AppHeader/AppFooter: gemensam header med logo, nav-tabs (Familj/Område med aktiv markering), LanguageSwitcher på alla sidor
- BorisButton: EN konsoliderad Boris-komponent med `context="family"|"area"` (sky-tema/emerald-tema)
- Borttagna: Boris.tsx + BorisCoach.tsx (ersatta av BorisButton)
- Rensade copy-paste headers/footers från alla 13 sidor
- i18n: nav-nycklar (sv + en)

### Session 8 – QA-härdning + prod-säkring (2026-02-09)
- Migration `20260209120000_add_captain_quiz_tables` – ADD ONLY, skapar Captain-tabeller i prod
- Status-sida `/[locale]/status` – app info, DB ping, env-check
- QA smoke test-checklista (nedan)
- Migrationsdokumentation för prod (nedan)

---

## QA Smoke Test – Checklista

Kör igenom dessa steg efter varje deploy. Alla ska vara OK.

### Familj-flödet
- [ ] `/sv` → startsida laddar, Boris visas, Familj+Område-kort synliga
- [ ] Klicka "Familj" i nav → `/sv/familj` → Captain + Guardian-kort
- [ ] Klicka Captain → `/sv/familj/captain` → login-formulär med profilval
- [ ] Byt språk (EN) i headern → sidan byter till engelska, URL uppdateras
- [ ] Klicka Guardian → `/sv/familj/guardian` → dashboard med admin-nyckel

### Område-flödet (Trygg Nära)
- [ ] Klicka "Område" i nav → `/sv/omrade` → områdeslista med sök
- [ ] Klicka Södermalm → `/sv/omrade/sodermalm` → händelselista (bara APPROVED)
- [ ] Klicka "Rapportera" → regelruta visas först → "Jag förstår" → formulär
- [ ] Skicka rapport → tack-sida med "24–48 timmar"
- [ ] `/sv/omrade/admin` → ange admin-nyckel → pending-rapporter visas
- [ ] Godkänn rapport → syns på dashboard
- [ ] CSV-export fungerar

### Landningssida
- [ ] `/sv/trygg-nara` → hero, kort, flöde, Boris, FAQ, Om piloten
- [ ] `/en/trygg-nara` → samma på engelska

### Navigation & Layout
- [ ] AppHeader sticky på alla sidor
- [ ] Nav-tabs: Familj/Område markerar rätt flik
- [ ] Logo (🐙) → tillbaka till startsida
- [ ] LanguageSwitcher synlig och fungerar på ALLA sidor
- [ ] AppFooter synlig på alla sidor

### System
- [ ] `/sv/status` → visar app info, DB ping OK, env-check
- [ ] `npm run build` → 0 errors
- [ ] Vercel deploy → grön build

---

## Prisma Migrations – Prod (Neon)

### Befintliga migrationer

| # | Namn | Vad den gör |
|---|------|-------------|
| 1 | `20260207100321_init` | Grundtabeller: Guardian, Kid, Lesson, LessonTranslation, Area, AreaEvent, BorisLog |
| 2 | `20260207103258_add_event_enums` | EventType + EventStatus enums, reporterName, resolvedAt |
| 3 | `20260207115400_add_event_moderation` | PENDING/APPROVED/REJECTED, default PENDING |
| 4 | `20260209120000_add_captain_quiz_tables` | **NY** – QuizQuestion, QuizQuestionTranslation, QuizAttempt, Kid.locale, FK Cascade |

### Migration 4 saknas troligen i prod

Om Captain-sidorna ger databasfel i prod beror det på att migration 4 inte körts.

### Så kör du migration på Neon (prod) – säkert

**Alternativ A: Via Vercel build (rekommenderat)**

Lägg till i `package.json` scripts:
```json
"postinstall": "prisma generate",
"vercel-build": "prisma migrate deploy && next build"
```
Eller sätt i Vercel Settings → Build Command:
```
npx prisma migrate deploy && next build
```

**Alternativ B: Manuellt via terminal**

```bash
# Kontrollera att rätt DATABASE_URL är satt (prod, INTE pooler)
# Neon Direct URL (utan -pooler):
# postgresql://...@ep-small-mouse-agpsoekg.eu-central-1.aws.neon.tech/netsailorcore?sslmode=require

DATABASE_URL="<direct-url>" npx prisma migrate deploy
```

**VIKTIGT:**
- `migrate deploy` kör BARA pending migrations – den skapar inga nya
- Migration 4 är ADD ONLY – inga DROP, inga RENAME, inga dataförluster
- Testa ALLTID lokalt först med `npx prisma migrate dev`
- Om du använder Neon pooler (pgbouncer) i `DATABASE_URL`: pooler fungerar INTE för migrations. Använd Direct URL.

---

## Env vars (Vercel + lokalt)

```
DATABASE_URL  # Neon Postgres → netsailorcore (pooler för app, direct för migration)
ADMIN_KEY     # Admin-nyckel för moderation (x-admin-key header)
```

Sätts automatiskt av Vercel:
```
VERCEL                 # "1" om vi kör på Vercel
VERCEL_GIT_COMMIT_SHA  # Git commit hash (visas på /status)
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
| DB | `netsailorcore` @ Neon (ep-small-mouse-agpsoekg) |

⚠️ **Deployment Protection** är aktivt – stäng av för Production i Vercel Settings → Deployment Protection.

---

## Viktiga länkar

| Vad | URL |
|-----|-----|
| **Lokal dev** | `http://localhost:3000` |
| **Status** | `http://localhost:3000/sv/status` |
| **Familj** | `http://localhost:3000/sv/familj` |
| **Captain** | `http://localhost:3000/sv/familj/captain` |
| **Guardian** | `http://localhost:3000/sv/familj/guardian` |
| **Landningssida (sv)** | `http://localhost:3000/sv/trygg-nara` |
| **Område (sv)** | `http://localhost:3000/sv/omrade` |
| **Dashboard Södermalm** | `http://localhost:3000/sv/omrade/sodermalm` |
| **Rapportera** | `http://localhost:3000/sv/omrade/sodermalm/rapportera` |
| **Admin** | `http://localhost:3000/sv/omrade/admin` |
| **GitHub** | `https://github.com/Mats6102hamberg/net-sailor-core` |
| **Vercel (prod)** | `https://net-sailor-core-mats-hambergs-projects.vercel.app` |

---

## Nästa steg

1. Kör migration 4 på Neon prod (se instruktioner ovan)
2. Koppla Boris till riktig AI
3. Clerk auth (alla roller)
4. Rate limiting innan publik lansering
5. Notifiering till admin vid nya rapporter
6. Statistiksektion på landningssidan (när det finns riktiga användare)

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
