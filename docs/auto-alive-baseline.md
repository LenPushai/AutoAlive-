# Auto Alive — Baseline Audit

**Repo:** `C:\Users\lenkl\WebstormProjects\autoalive1-1` (GitHub `LenPushai/AutoAlive-`)
**Branch:** `master` @ `4f72ab8` — "hardcode Supabase values in all 4 client files"
**Audit date:** 2026-07-24
**Method:** read-only static review + one production build. No source files were modified.

---

## 0. Executive summary

The build is green and the public site is real, but the app is best described as **two half-systems glued together**:

- A **hand-written, inline-styled JSX layer** (`(public)/*.jsx`, `(admin)/dashboard/*.tsx`) that actually talks to Supabase from the browser and does most of the visible work.
- A **scaffolded TypeScript layer** (`src/components/**`, `src/app/api/**`, `src/lib/**`, `src/types/**`) that is almost entirely **empty stubs and TODOs**, and is **never imported by anything that renders**.

Roughly 13 of the "component" files in `src/components` are 4-line placeholders. Every one of the 7 API routes is dead — **no client code calls `/api/*` anywhere**. Two of them are literal `return NextResponse.json({ message: 'TODO' })`.

The three highest-severity findings:

1. **The `/contact` form silently discards every lead** — it inserts columns that do not exist (`customer_name`, `customer_phone`, `customer_email`), never checks the returned error, and shows the customer a success screen anyway. (`src/app/(public)/contact/page.jsx:23`)
2. **The leads kanban writes a status the database rejects** — the board's `test_drive` column is not in the `leads.status` CHECK constraint, and `qualified` leads are invisible on the board. (`src/app/(admin)/dashboard/leads/page.tsx:8`)
3. **The committed migrations cannot run.** Every single-quote in `supabase/migrations/*.sql` and `supabase/seed/seed.sql` is doubled (`''available''`), so the SQL in the repo is not what created the live database. There is no trustworthy schema-of-record.

---

## 1. Stack & state

### 1.1 Framework / versions

| Item | Version | Note |
|---|---|---|
| Next.js | **16.1.6** | App Router, Turbopack |
| React / React DOM | 19.2.3 | |
| TypeScript | ^5 | `strict: true`, but bypassed — see below |
| Tailwind CSS | ^4 (`@tailwindcss/postcss`) | Configured, **barely used** — nearly all UI is inline `style={}` objects |
| `@supabase/ssr` | ^0.8.0 | |
| `@supabase/supabase-js` | ^2.98.0 | |
| `zod` | ^4.3.6 | Validators written; only reachable from dead API routes |
| `resend` | ^6.9.3 | Client + templates written; **never invoked** |
| `lucide-react`, `date-fns`, `clsx`, `tailwind-merge` | — | Installed, effectively unused |
| Node/deploy | Vercel, project `autoalive` (`.vercel/project.json`) | |

### 1.2 Build health — **PASSES**

`npm run build` exits 0. 22 routes generated, compiled in ~10.6s.

Warnings that matter:

- `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.` — Next 16 deprecation; will break on a future major.
- `⚠ Next.js inferred your workspace root ... selected C:\Users\lenkl\WebstormProjects\package-lock.json` — a stray parent-directory lockfile is being treated as the workspace root. Harmless today, a foot-gun later.

**The green build is misleading.** It is green partly because type checking has been switched off in the files that need it most:

- `src/app/api/vehicles/route.ts:1` — `// @ts-nocheck`
- `src/app/api/leads/route.ts:1` — `// @ts-nocheck`
- `src/app/api/contact/route.ts:1` — `// @ts-nocheck`
- Widespread `(sb.from('x') as any)` casts across every dashboard page, defeating the generated `Database` types.

`npx eslint` reports **85 errors, 19 warnings**, including `@ts-nocheck` bans and `require()` imports in the root-level `.js` scripts.

There is a **latent runtime error hiding behind `@ts-nocheck`**: `src/app/api/leads/route.ts:9-11` reads

```ts
const { data, error } = await supabase
  (supabase.from('leads') as any)
  .select('*, vehicles(make, model, year)')
```

That calls `supabase(...)` as a function. It would throw `TypeError: supabase is not a function` on first request. It has never been noticed because nothing calls the route.

### 1.3 Environment handling — hardcoded credentials

The last five commits are a running battle with Vercel env vars (`force redeploy with env variables` ×2 → `force-dynamic for Supabase env vars` → `hardcode Supabase values ...` ×3). The result is credentials baked into source.

**Full inventory of hardcoded values in tracked source:**

| # | File:line | Value | Severity |
|---|---|---|---|
| 1 | `src/lib/supabase/client.ts:6` | Supabase URL `https://aujxwbbsjdyqxzkelybp.supabase.co` | Med |
| 2 | `src/lib/supabase/client.ts:7` | Supabase **anon JWT** (literal `eyJhbGci...IEHak`) | Med |
| 3 | `src/lib/supabase/client.js:5` | Supabase URL (duplicate) | Med |
| 4 | `src/lib/supabase/client.js:6` | Supabase anon JWT (duplicate) | Med |
| 5 | `src/lib/supabase/server.ts:9` | Supabase URL | Med |
| 6 | `src/lib/supabase/server.ts:10` | Supabase anon JWT | Med |
| 7 | `src/lib/supabase/server.js:8` | Supabase URL (duplicate) | Med |
| 8 | `src/lib/supabase/server.js:9` | Supabase anon JWT (duplicate) | Med |
| 9 | `next.config.js:8` | Supabase project host `aujxwbbsjdyqxzkelybp.supabase.co` in `images.remotePatterns` | Low |
| 10 | `src/app/(admin)/dashboard/inventory/new/page.tsx:6` | `const DEALER_ID = '00000000-0000-0000-0000-000000000001'` | **High** (blocks multi-tenant; silently mis-attributes stock) |
| 11 | `src/lib/data/vehicles.js:3` | Same dealer UUID as env fallback | Med |
| 12 | `src/app/(public)/page.jsx:309,342` | WhatsApp number **`wa.me/27000000000`** (placeholder) | **High** |
| 13 | `src/app/(public)/about/page.jsx:174` | `wa.me/27000000000` | **High** |
| 14 | `src/app/(public)/contact/page.jsx:106,155,228,277` | `wa.me/27000000000` (×4) | **High** |
| 15 | `src/app/(public)/inventory/page.jsx:789,825` | `wa.me/27000000000` (×2) | **High** |
| 16 | `src/app/(public)/inventory/[id]/page.jsx:160,551` | `wa.me/27000000000` (×2) | **High** |
| 17 | `src/components/layout/Footer.jsx:42` | `wa.me/27000000000` | **High** |
| 18 | `src/config/site.ts:9-12` | `url: 'https://autoalive.co.za'`; `contact.phone/email/address/whatsapp` all empty strings marked "Paul to confirm" | Med |
| 19 | `src/lib/email/client.ts:5` | `EMAIL_FROM = 'Auto Alive <noreply@autoalive.co.za>'` | Low |
| 20 | `src/app/(public)/inventory/page.jsx:19`, `[id]/page.jsx:18` | Interest rate `13.75` hardcoded; `src/config/constants.ts:34` says `11.75` — **two different rates shipped on the same site** | Med |
| 21 | `supabase/seed/seed.sql:9-13` | Dealer email `info@autoalive.co.za`, phone `016 000 0000`, address `TBC` | Low |

**Notes on severity.** The anon key is publicly-shipped-by-design (it ends up in the browser bundle either way), so hardcoding it is not a secret leak — it is a **deployment-hygiene and key-rotation** problem: rotating the Supabase key now requires a code change and redeploy across 8 sites, and staging/prod can never be separated. The service-role key was **not** hardcoded anywhere (`src/lib/supabase/admin.ts` and `.js` still read `process.env.SUPABASE_SERVICE_ROLE_KEY`) — good.

**Nine WhatsApp links point at `+27 00 000 0000`.** Every WhatsApp CTA on the live public site is dead. This is the single cheapest high-impact fix in the repo.

**Env files.**

- `.env.local` is correctly **untracked** (`git ls-files | grep env` → empty) and `.gitignore` covers `.env*`. No secrets in git history for env files.
- `.env.local` is nonetheless **malformed**: lines 1–5 are leftover markdown from a chat transcript (`notepad .env.local`, ` ``` `, `Replace the entire contents with:`, ` ``` `) before the actual variables on lines 6–10. It parses today because dotenv ignores the junk, but it is one bad edit away from breaking local dev.
- `.env.local` defines `NEXT_PUBLIC_DEALER_ID` — which **`.env.local.example` does not document**. Anyone cloning the repo gets a broken `src/lib/data/vehicles.js` fallback.

**The remaining env-var dependency that will bite production.** `src/lib/supabase/middleware.ts` (the file that actually guards `/dashboard`) still reads `process.env.NEXT_PUBLIC_SUPABASE_URL!` and `NEXT_PUBLIC_SUPABASE_ANON_KEY!`. Those are inlined at *build* time. If a Vercel build runs without them set, `createServerClient(undefined, undefined)` throws and **every `/dashboard` request 500s** — the exact failure mode the "hardcode" commits were fighting, in the one file they missed.

### 1.4 Middleware — works, but by accident

There are **two** middleware entrypoints:

- `middleware.js` (repo root) → calls `updateSession()` → real Supabase auth check → redirects to `/login`.
- `src/middleware.ts` → `return NextResponse.next()` — a **no-op that protects nothing**.

Next.js currently resolves to the root file. Verified by decompiling `.next/server/edge/chunks/[root-of-the-server]__debdaabb._.js`, which contains the Supabase client and the `pathname.startsWith("/dashboard") && !user → redirect /login` logic.

So auth **is** enforced today. But it hangs on undocumented resolution order between two conflicting files, one of which is a silent no-op. If anyone deletes `middleware.js` (plausible — it's the deprecated convention Next is warning about), the dashboard becomes **world-readable with no error message**.

---

## 2. Feature inventory vs Phase 1 claims

| # | Phase 1 claim | Verdict | Evidence |
|---|---|---|---|
| 1 | Vehicle search & filters (make/model/year/price/mileage/fuel) | **PARTIAL** | see 2.1 |
| 2 | Vehicle detail pages, photos, badges | **PARTIAL** | see 2.2 |
| 3 | Finance calculator (live adjust, WhatsApp apply) | **PARTIAL** | see 2.3 |
| 4 | WhatsApp click-to-chat with pre-filled vehicle payload | **PARTIAL** | see 2.4 |
| 5 | Lead capture → CRM, source tagging, auto-assignment | **PARTIAL / BROKEN** | see 2.5 |
| 6 | Leads kanban, lead detail views | **PARTIAL** | see 2.6 |
| 7 | Admin: add/edit/sold vehicles, photo management | **PARTIAL** | see 2.7 |
| 8 | Reports (stock ageing, conversion, sources), team performance | **ABSENT** | see 2.8 |
| 9 | Auth / login protection | **BUILT** (fragile) | see 2.9 |

### 2.1 Vehicle search & filters — PARTIAL

**Built** (`src/app/(public)/inventory/page.jsx:455-505`): client-side free-text search across make/model/variant/body_type/colour; category tabs (Cars/Bakkies/SUVs/Motorcycles); filters for **make**, **transmission**, **fuel**, and **price band**; sorts by newest / price ↑↓ / year ↓ / mileage ↑.

**Missing vs the claim:**
- **No model filter** — model is only reachable via free-text search.
- **No year filter** — year is a *sort* option only.
- **No mileage filter** — mileage is a *sort* option only.
- Price is 5 fixed bands (`PRICE_RANGES`, line 39), not a range control.

**Architectural problem:** all filtering is **client-side over the full table**. `page.jsx:461` fetches every `status='available'` row with `.select("*")` and no limit, then filters in a `useMemo`. Fine at 20 cars, a real problem at 200 — the page ships every vehicle's full description and image array to the browser on load. `ITEMS_PER_PAGE = 12` exists in `src/config/constants.ts:41` but **nothing paginates**.

**Dead parallel implementation:** `src/components/vehicles/vehicle-filters.tsx` is a 4-line stub; `src/types/vehicle.ts:33` defines a complete `VehicleFilters` interface (yearMin/yearMax/priceMin/priceMax/page/limit/sort) that **nothing implements**. `src/app/api/vehicles/route.ts:11` has `// TODO: Apply filters from searchParams`.

### 2.2 Vehicle detail pages, photos, badges — PARTIAL

**Built** (`src/app/(public)/inventory/[id]/page.jsx`, 927 lines): full detail page; fetches by id; spec table (10 rows); image gallery with prev/next, thumbnail strip, **lightbox with Escape/←/→ keyboard nav**; photo-count chip; 404 state for missing/sold vehicles.

**Photos:** reads `thumbnail` + `images[]` from the row, de-duplicating the thumbnail. Rendering is solid. **Getting photos in is the problem** — see 2.7.

**Badges — this is where the claim breaks down.** The only badge implemented anywhere is **"Featured"** (`inventory/page.jsx:353`, `[id]/page.jsx` ~line 231, `(public)/page.jsx:195`), driven by `is_featured`.

- **Just Listed** — ABSENT. `created_at` exists and is selected; no code computes recency.
- **Price Drop** — ABSENT. The string appears **once**, in `src/lib/mock-data.js:45`, as static demo data on a `badge:` field. There is **no `previous_price` column** in the schema, so price-drop detection is not merely unimplemented — it is **not yet possible without a schema change**.
- **Sold** — ABSENT on the public site. `src/app/(public)/inventory/page.jsx:461` filters `.eq("status", "available")`, so sold cars simply vanish rather than showing a SOLD overlay. The detail page has no status handling either — a sold car's URL still renders as a live, buyable listing with a working enquiry form.

**Schema drift:** `[id]/page.jsx:165` renders `v.condition`. There is **no `condition` column**. It always renders `—`.

**Dead parallel implementation:** `vehicle-gallery.tsx`, `vehicle-specs.tsx`, `vehicle-card.tsx` are all 4-line stubs.

### 2.3 Finance calculator — PARTIAL

**Three separate, inconsistent implementations exist.**

| Impl | Location | Live adjust? | Rate | Fees | Balloon |
|---|---|---|---|---|---|
| A — Homepage | `(public)/page.jsx:231-250` | ✅ price, deposit, term sliders | 13.75% | none | none |
| B — Detail page | `(public)/inventory/[id]/page.jsx:202-238` | ✅ deposit, term sliders | 13.75% | none | none |
| C — The real one | `src/lib/utils/finance.ts` + `src/hooks/use-finance-calculator.ts` | ✅ deposit/rate/term/balloon | **11.75%** | init R1207.50 + R69/mo | ✅ |

Implementation **C is correct and complete** — it's the only one that models SA vehicle finance properly (initiation fee, monthly service fee, balloon discounted to present value, total interest). It is **imported by nothing**. Its only consumer would be `src/components/forms/finance-calculator.tsx`, which is a 4-line stub.

So the site ships the two naive calculators (A and B), which:
- use **13.75%** while `FINANCE_DEFAULTS` says **11.75%** — the homepage note even claims "*Based on prime + 2%*";
- omit initiation and service fees entirely, **understating the real monthly payment**;
- have **no balloon input**, while the homepage bullet at line 228 advertises "*Includes balloon payment options*".

Card tiles (`inventory/page.jsx:369`) call `calcMonthly(v.price, 0, 72, 13.75)` — a zero-deposit, 72-month "From R.../pm" figure.

**"WhatsApp apply" — ABSENT.** The homepage bullet (line 229) advertises "*Apply for pre-approval via WhatsApp*". There is no button, link, or handler that carries any calculator state into WhatsApp. The floating WhatsApp button is a bare `wa.me/27000000000` with no `?text=`.

### 2.4 WhatsApp click-to-chat with pre-filled payload — PARTIAL

**Exactly one link in the codebase pre-fills a vehicle payload** — `src/app/(public)/inventory/[id]/page.jsx:160`:

```js
var wa = "https://wa.me/27000000000?text=" +
  encodeURIComponent("Hi, I'm interested in the " + title + " (" + formatZAR(v.price) + ") on Auto Alive.");
```

That is correct in shape (year/make/model/variant + formatted price). **Every other WhatsApp link — all 8 of them — has no `?text=` at all.**

One near-miss worth noting: `src/app/(public)/inventory/page.jsx:789` pre-fills generic text ("*I'm looking for a specific vehicle*") but carries **no vehicle context**, despite sitting on a page full of vehicles.

Admin side (`(admin)/dashboard/leads/page.tsx:262`) builds `wa.me/27<phone>` from the lead's number with `.replace(/^0/,'')` — correct SA normalisation, but **no `?text=`**, so a salesperson gets an empty chat with no context about which car the lead enquired on.

**And all of it is inert until the placeholder number is replaced.** Nine dead links.

### 2.5 Lead capture → CRM, source tagging, auto-assignment — PARTIAL / BROKEN

There are **three** lead-capture paths. They disagree with each other and with the schema.

**Path A — vehicle detail enquiry form** (`(public)/inventory/[id]/page.jsx:90-117`) — **WORKS.** Correct columns, splits full name into `first_name`/`last_name`, carries `vehicle_id` and `dealer_id` from the vehicle row, sets `source: 'website'`, `status: 'new'`, checks `error`, surfaces it. This is the one good path.

Caveat: it is littered with debugging left in place — `console.log('=== LEAD INSERT PAYLOAD ===', payload)` (line 105), `console.log('=== FULL RESPONSE ===')` (line 112), and on failure it shows the customer a raw `alert('Error 23505: duplicate key value...')`. **Customer PII (name, phone, email) is logged to the browser console on every submission.**

**Path B — `/contact` page form** (`(public)/contact/page.jsx:23-30`) — **SILENTLY BROKEN. Every lead is lost.**

```js
await sb.from("leads").insert({
  customer_name: form.name,       // ← column does not exist
  customer_phone: form.phone,     // ← column does not exist
  customer_email: form.email,     // ← column does not exist
  notes: form.msg || "General enquiry from contact page",
  source: "website",
  status: "new",
});
```

Three compounding failures:
1. Column names are from an **older schema** — the table has `first_name`, `last_name`, `phone`, `email`.
2. **`dealer_id` is omitted**, and it is `NOT NULL` — so even with correct column names this insert fails.
3. **The return value is never checked.** `supabase-js` resolves with `{ error }` rather than throwing, so the surrounding `try/catch` catches nothing, `setSent(true)` runs, and the customer sees a thank-you screen. The lead is gone with no trace anywhere.

**Path C — `/api/contact` route** (`src/app/api/contact/route.ts`) — **DEAD.** Correctly written (zod-validated, right columns) but `dealer_id: ''` is a TODO placeholder that would fail the FK, and **nothing calls it** — there is no `fetch('/api/contact')` anywhere in `src`.

**Source tagging — PARTIAL.** Every write path hardcodes `source: 'website'`. Nothing sets `whatsapp`, `autotrader`, `facebook`, `walkin`, `phone`, or `referral`. The kanban *displays* eight source badges (`leads/page.tsx:14-23`) including `carscoza`, `tiktok`, `instagram` — **five of which the database CHECK constraint would reject** and none of which any code can produce. Read-side polish over a write-side that only ever emits one value.

**Auto-assignment — ABSENT.** `leads.assigned_to` exists in the schema and in `src/types/lead.ts:13`. **No code reads or writes it.** No round-robin, no rules, no manual assignment UI. Every lead lands unassigned forever.

### 2.6 Leads kanban, lead detail views — PARTIAL

**Built** (`(admin)/dashboard/leads/page.tsx`, 277 lines): 6-column board with per-column counts; kanban ⇄ table toggle; quick "→ Stage" buttons on each card; status dropdown in table view; click-through modal showing phone/email/date/status, enquired vehicle with price, notes, stage buttons, and Call / WhatsApp / Delete actions.

For a hand-rolled board it is genuinely usable. But:

**🔴 The board's stages do not match the database.** `COLUMNS` (line 8) declares `test_drive`. The schema's CHECK constraint is `('new','contacted','qualified','negotiating','won','lost')`.

- Clicking **"→ Test Drive"** fires an UPDATE that Postgres **rejects with a CHECK violation**. `moveLead()` (line 58) never inspects the error — it just calls `load()` and the card silently snaps back. To a user this reads as "the board is flaky."
- Any lead with status **`qualified`** matches **no column** and is **invisible on the board** — though it still appears in table view. Leads can disappear from the pipeline with no indication.

**No drag-and-drop.** Movement is via buttons/dropdown only. `src/components/leads/lead-kanban.tsx` is a stub.

**Lead detail is a modal, not a view.** No route, no deep link, no shareable URL. And it is **read-only** — you cannot edit a name, add a note, log a call, set a follow-up, or assign an owner. `lead_timeline` exists in the schema and `LeadTimelineEntry` in `src/types/lead.ts:24` — **neither is ever read or written**. `src/components/leads/lead-timeline.tsx` is a stub.

**Three untracked drafts sit in the repo root** — `leads-page.tsx`, `leads-page (1).tsx`, `leads-page (2).tsx` (plus `src/app/(admin)/dashboard/leads/page.tsx.bak`). `leads-page (2).tsx` is the most advanced: it **fixes the `test_drive` → `qualified` bug**, adds a Google Ads source badge, a days-in-pipeline chip, and a much richer detail panel (finance provider, trade-in, follow-up date, assigned-to, stage history, threaded notes).

**But that panel is fed by a hardcoded `MOCK_ENRICHMENT` object** (line 25) — fixed names "Leon"/"Paul", fixed March-2026 dates, three fake note entries, returned by `getMock()` for **every** lead. It is a demo mock, not an implementation. Treat it as a **design spec for the punch-list**, not as work already done — and be aware that merging it as-is would put fabricated customer notes in front of a real user.

### 2.7 Admin: add/edit/sold vehicles, photo management — PARTIAL

**Built:** list with live search + status/featured columns (`inventory/page.tsx`); create form (`inventory/new/page.tsx`, ~18 fields); edit form (`inventory/[id]/page.tsx`); delete with `confirm()`; one-click status toggle available ⇄ sold (`inventory/page.tsx:35`).

**🔴 Photo management — ABSENT.** This is the biggest gap in the admin.

- Neither the create nor the edit form has **any** image input. `new/page.tsx:31` hardcodes `images: []` on insert. `[id]/page.tsx`'s update payload **omits `images` and `thumbnail` entirely**.
- `POST /api/upload` (`src/app/api/upload/route.ts`) is correctly written against the `vehicle-photos` bucket — and is **called by nothing**.
- The only working path is a **standalone Node script**, `upload-bmw-photos.js` at the repo root, run manually against a local `bmw-x5-photos/` folder (19 WhatsApp JPEGs, committed to git).

**Practical consequence: Paul cannot add a car with photos through the admin UI at all.** Every listing with images was populated by hand. This is the load-bearing gap for day-to-day operation.

**Other issues:**

- **`dealer_id` hardcoded** at `new/page.tsx:6`.
- **Status values exceed the schema.** Both forms offer `pending` in the status dropdown (`new/page.tsx` line ~114, `[id]/page.tsx` similar). The CHECK constraint allows only `available`/`reserved`/`sold`. Selecting **Pending** fails the insert — and while `new/page.tsx` does `alert()` the error, `inventory/page.tsx:35`'s `toggleStatus` ignores errors entirely.
- **No sale record on "sold".** Toggling to sold writes `vehicles.status` and nothing else — see §3.
- `vin` and `registration` columns exist; **neither form exposes them**.
- `src/components/forms/vehicle-form.tsx` is a stub; `vehicleSchema` (a complete zod validator) is used by **no form** — validation is three `if (!form.make ...)` checks and an `alert()`.

### 2.8 Reports & team performance — ABSENT

Nothing exists. A repo-wide grep for `ageing|aging|conversion|report|days_in_stock` returns **two** hits: the word "Sold" in a dashboard stat-card label, and `badge: "Price Drop"` in mock data.

- **Stock ageing** — ABSENT. (`created_at` is available, so this is computable today.)
- **Conversion reporting** — ABSENT. (Requires the leads→sales link, which doesn't exist — §3.)
- **Source reporting** — ABSENT, and currently **impossible to make meaningful**: every lead is `source='website'` (§2.5).
- **Team performance** — ABSENT, and **blocked**: `leads.assigned_to` and `sales.salesperson_id` are never written, so there is no per-person data to report on.
- `/dashboard/users` (`users/page.tsx`, 9 lines) is a heading and two HTML comments.
- `/dashboard/sales` (`sales/page.tsx`, 10 lines) is a heading and two HTML comments.
- `/dashboard/settings` (`settings/page.tsx`, 9 lines) is a heading and one comment.

The nearest thing to a report is four count tiles on `/dashboard` (`dashboard/page.tsx:26`): vehicles in stock, total leads, new leads, vehicles sold. Four `count: 'exact', head: true` queries — no trends, no dates, no breakdowns.

### 2.9 Auth / login protection — BUILT (fragile)

**Works:** `/login` (`(auth)/login/page.tsx`) does `signInWithPassword` with error display and redirects to `/dashboard`. Middleware guards `/dashboard/:path*` server-side and redirects unauthenticated users to `/login`. Sign-out in `admin-sidebar.tsx:18`. RLS policies exist in `00002_rls_policies.sql` (dealer-scoped for all tables, public SELECT on available vehicles, public INSERT on `source='website'` leads).

**Fragilities:**

1. **The two-middleware ambiguity** (§1.4) — one of them is a no-op that silently disables all protection.
2. **Middleware still depends on env vars** (§1.3) — missing vars at build time means every `/dashboard` request 500s.
3. **No role enforcement anywhere.** The schema defines `owner`/`manager`/`salesperson` (`00001_initial_schema.sql`, `src/types/user.ts`), and RLS scopes by *dealer* — but **not by role**. Any authenticated user can delete any vehicle or lead in the dealership. `useUser()` (`src/hooks/use-user.ts`) exists but is imported by nothing; **no page ever checks a role**.
4. **`loginSchema` is unused** — the login form does no client-side validation. Minor.
5. **RLS depends on a `users` row existing** for every auth user. `SELECT dealer_id FROM users WHERE id = auth.uid()` returns NULL for an auth user with no profile row, and every dealer-scoped policy then fails closed — a login that "works" but shows an empty dashboard. There is no signup/profile-provisioning code anywhere; rows must be created by hand in Supabase.

---

## 3. Phase 1 punch-list state

| Punch-list item | State | Detail |
|---|---|---|
| **Lead detail views** | **~30%** | Read-only modal, no route/deep-link, no editing, no notes, no timeline. `leads-page (2).tsx` sketches the target UI but with `MOCK_ENRICHMENT` fake data. `lead_timeline` table + `LeadTimelineEntry` type exist, entirely unused. |
| **Photo management** | **~10%** | `POST /api/upload` written and correct — **called by nothing**. Zero UI in either vehicle form; edit form doesn't even send `images`/`thumbnail`. Public gallery/lightbox renders photos well. Only real path is the manual `upload-bmw-photos.js` script. |
| **Automatic sale records** | **~0%** | Nothing writes to `sales`. See below. |
| **Notifications** | **~5%** | Resend installed; `src/lib/email/client.ts` + two templates in `templates.ts` written. **`resend.emails.send()` is never called anywhere.** `api/contact/route.ts:38` has `// TODO: Send notification emails via Resend` — and that route is itself dead. No in-app, SMS, or WhatsApp notifications. |

### Automatic sale records — the deepest gap

Marking a car sold today (`inventory/page.tsx:35`) does exactly one thing: `UPDATE vehicles SET status='sold'`.

Not done: no `sales` row, no `sale_price`, no `sale_date`, no `salesperson_id`, no link to the winning lead, no `sale_verifications` row, no lead moved to `won`, no invoice, no billing event.

The scaffolding for the intended "5-layer verification" system is fully specified and **fully unimplemented**:

- `sale_verifications` table — complete, with all 5 layers, anomaly flags, `billing_amount DEFAULT 1000.00`, `invoice_generated`.
- `src/types/sale.ts` — complete TypeScript interfaces.
- `POST /api/sales` — body is three TODO comments and `return NextResponse.json({ message: 'TODO' }, { status: 201 })`.
- `PATCH /api/sales/verify` — three TODO comments and `{ message: 'TODO' }`.
- `/dashboard/sales/verification/page.tsx` — 15 lines, all comments.
- `src/components/sales/verification-table.tsx` — 4-line stub.

**This blocks the commercial model.** `src/config/site.ts:20` sets `billing.perCarFee: 1000` (R1,000/car sold). There is **no code path that records a sale**, so there is nothing to bill against. Conversion reporting and team performance are blocked behind the same gap.

---

## 4. DB expectations — what the code actually touches

Diff this against live Supabase.

### 4.1 Tables read/written by code

| Table | Ops | Where |
|---|---|---|
| `vehicles` | SELECT, INSERT, UPDATE, DELETE | `(public)/page.jsx:54`, `(public)/inventory/page.jsx:461`, `(public)/inventory/[id]/page.jsx:41`, `(admin)/dashboard/page.tsx:14,17`, `inventory/page.tsx:20,33,38`, `inventory/new/page.tsx:26`, `inventory/[id]/page.tsx:16,28`, `api/vehicles/route.ts:13,32`, `lib/data/vehicles.js` |
| `leads` | SELECT, INSERT, UPDATE, DELETE | `(public)/contact/page.jsx:23`, `(public)/inventory/[id]/page.jsx:109`, `dashboard/page.tsx:15,16,18`, `dashboard/leads/page.tsx:49,61,70`, `api/leads/route.ts`, `api/contact/route.ts:26` |
| `sales` | SELECT only | `api/sales/route.ts:8` (dead route) |
| `sale_verifications` | SELECT via join only | `api/sales/route.ts:9` — `sale_verifications(*)` |
| `dealers` | SELECT | `lib/data/vehicles.js:58` |
| `users` | **never touched by app code** | referenced only inside RLS policy subqueries |
| `lead_timeline` | **never touched** | table + type defined, zero usage |

### 4.2 Columns the code expects

**`vehicles`** — `id, dealer_id, make, model, variant, year, price, mileage, fuel_type, transmission, colour, body_type, engine_size, vin, registration, status, description, features[], images[], thumbnail, is_featured, created_at, updated_at`

- ⚠️ **`condition`** — read at `(public)/inventory/[id]/page.jsx:165`. **Not in the schema.** Either add the column or drop the spec row.
- ⚠️ `status` — code emits **`pending`**, schema CHECK allows only `available`/`reserved`/`sold`.
- ⚠️ `previous_price` — **does not exist**; required before "Price Drop" badges are possible.
- ⚠️ `vin`, `registration` — in schema, exposed by no form.

**`leads`** — `id, dealer_id, vehicle_id, first_name, last_name, email, phone, source, status, notes, assigned_to, lost_reason, created_at, updated_at`

- 🔴 **`customer_name`, `customer_phone`, `customer_email`** — written by `(public)/contact/page.jsx:24-26`. **Do not exist.** Every `/contact` submission fails.
- ⚠️ `status` — code emits **`test_drive`** (kanban); CHECK allows `qualified` instead. Column also renders as `qualified` in `leads-page (2).tsx`.
- ⚠️ `source` — code renders `carscoza`, `tiktok`, `instagram`, `googleads`, `other`; CHECK allows `website`, `whatsapp`, `autotrader`, `facebook`, `walkin`, `phone`, `referral`. Five display values are unwritable; two allowed values (`whatsapp`, `phone`) have no badge.
- ⚠️ `assigned_to`, `lost_reason` — in schema, never read or written.

**`sales`** — `id, dealer_id, vehicle_id, lead_id, sale_price, sale_date, salesperson_id, created_at`. Read-only via one dead route; **never written**.

**`sale_verifications`** — all 5 layers + `anomaly_flags[]`, `billing_amount`, `invoice_generated`. Selected via join in one dead route; **never written**.

**`dealers`** — `id, name, slug, email, phone, address, city, province, logo_url, operating_hours, created_at`. `lib/data/vehicles.js:58` selects by the hardcoded dealer UUID.

**`lead_timeline`** — `id, lead_id, action, details, created_by, created_at`. Zero usage.

**`users`** — `id, dealer_id, email, full_name, role, phone, is_active, avatar_url, created_at, updated_at`. Never touched by app code, but **load-bearing for every RLS policy**.

### 4.3 Storage

- Bucket **`vehicle-photos`** — `api/upload/route.ts:18,24` (dead route) and `upload-bmw-photos.js`. Requires public read (`getPublicUrl`). `next.config.js` whitelists `aujxwbbsjdyqxzkelybp.supabase.co/storage/v1/object/public/**`.

### 4.4 Functions / triggers / views

- Function `update_updated_at()` + triggers on `vehicles`, `leads`, `users`, `sale_verifications`. Note the app **also sets `updated_at` manually** (`leads/page.tsx:61`, `inventory/[id]/page.tsx:34`) — harmless, but confirm the triggers actually exist live before relying on them.
- Extension `uuid-ossp`.
- **No RPC calls, no views, no realtime channels anywhere in the codebase.** (`.rpc(` and `.channel(` → zero hits.)

### 4.5 Foreign keys PostgREST joins depend on

Embedded selects will 400 if these FKs are missing live:

- `leads.vehicle_id → vehicles.id` — used by `leads/page.tsx:50` (`vehicles(make, model, year, price)`) and `api/leads/route.ts:11`
- `sales.vehicle_id → vehicles.id`, `sales.lead_id → leads.id`, `sale_verifications.sale_id → sales.id` — used by `api/sales/route.ts:9`

### 4.6 ⚠️ Do not trust the committed migrations

`supabase/migrations/00001_initial_schema.sql`, `00002_rls_policies.sql`, and `supabase/seed/seed.sql` all have **every single-quote doubled** — `''South Africa''`, `''available''`, `USING (status = ''available'')`. This is a quoting bug from the generator (`supabase-setup.ps1`). **These files will not execute.**

The live database therefore was **not** created from these files. Everything in §4 above describes *what the code expects*, which may or may not be what is live. **Dump the live schema before acting on any of it.**

---

## 5. Risks

### 5.1 🔴 Will bite immediately

| # | Risk | Impact |
|---|---|---|
| R1 | **`/contact` loses every lead, silently, with a fake success screen** (`contact/page.jsx:23`) | Live revenue loss. Nobody knows how many leads are already gone. |
| R2 | **Kanban `test_drive` violates the CHECK constraint; `qualified` leads are invisible** (`leads/page.tsx:8`) | Board looks broken; leads vanish from the pipeline. |
| R3 | **Nine WhatsApp links point at `+27 00 000 0000`** | Every WhatsApp CTA on the live site is dead. |
| R4 | **No photo upload in admin** | Paul cannot list a car with photos without a developer. |
| R5 | **Migrations are unrunnable (doubled quotes)** | No schema-of-record. Any punch-list work planned against these files is planned against fiction. |
| R6 | **Two conflicting middleware files, one a no-op** (`middleware.js` vs `src/middleware.ts`) | Deleting the deprecated one silently exposes the entire dashboard. Next 16 is actively warning about that file. |

### 5.2 🟠 Will bite during the punch-list

| # | Risk | Impact |
|---|---|---|
| R7 | **Errors ignored on nearly every write.** `toggleStatus`, `moveLead`, `deleteLead`, `handleDelete`, and the contact form never inspect `{ error }`. | Failures present as "flaky UI". Every punch-list bug report will be one of these. |
| R8 | **`@ts-nocheck` + `as any` everywhere** | Types provide zero protection on exactly the DB-boundary code that keeps drifting. Already hiding a genuine `TypeError` in `api/leads/route.ts:9`. |
| R9 | **`dealer_id` hardcoded** in `inventory/new/page.tsx:6` and `lib/data/vehicles.js:3` | Multi-tenancy is blocked; a second dealer silently gets the first dealer's stock. |
| R10 | **Middleware still reads env vars** while all four clients are hardcoded | A build without env vars 500s the whole dashboard. This is the unfinished half of the last five commits. |
| R11 | **No role enforcement.** RLS is dealer-scoped, not role-scoped; no page checks a role. | Any salesperson can delete any vehicle or lead. |
| R12 | **Two finance rates shipped (13.75% vs 11.75%), fees omitted** | Quoted monthly payments are wrong and mutually inconsistent. Customer-facing accuracy issue. |
| R13 | **Client-side-only filtering, no pagination** | Degrades sharply past ~100 vehicles; `ITEMS_PER_PAGE` exists but is unused. |
| R14 | **Customer PII logged to browser console + raw DB errors shown in `alert()`** (`inventory/[id]/page.jsx:105,112,116`) | Leaks names/phones/emails and internal schema detail to anyone with devtools. |

### 5.3 Dead code (delete candidates — measure before trusting anything here)

**Stub components — 13 files, all 4 lines, all exported via barrels, none imported by a rendering path:**
`vehicles/vehicle-card.tsx`, `vehicles/vehicle-filters.tsx`, `vehicles/vehicle-gallery.tsx`, `vehicles/vehicle-specs.tsx`, `forms/enquiry-form.tsx`, `forms/finance-calculator.tsx`, `forms/lead-form.tsx`, `forms/vehicle-form.tsx`, `leads/lead-kanban.tsx`, `leads/lead-timeline.tsx`, `dashboard/stats-cards.tsx`, `dashboard/recent-leads.tsx`, `sales/verification-table.tsx` (+ `layout/header.tsx`, `layout/footer.tsx` — TODO-only).

The barrel files (`index.ts`) make these look like a real component library in an IDE. **They are not.** Anyone importing `<VehicleCard />` from `@/components/vehicles` gets an empty `<div>` — and TypeScript will not complain, because the stubs take no props.

**Dead API routes — all 7.** No `fetch('/api/...')` exists anywhere in `src`. `api/sales` and `api/sales/verify` return literal `{ message: 'TODO' }`.

**Duplicate `.js`/`.ts` pairs** (the `.js` copies appear unused; `.ts` wins module resolution):
`lib/supabase/client.{js,ts}`, `server.{js,ts}`, `admin.{js,ts}`, `middleware.{js,ts}`, `app/(public)/layout.{jsx,tsx}`, `next.config.{js,ts}`.

⚠️ `src/lib/supabase/client.js:4` and `server.js:7` contain `createBrowserClient<any>(` / `createServerClient<any>(` — **TypeScript generic syntax inside a `.js` file**. These are syntax errors that only avoid breaking the build because nothing imports them. Strong evidence the `.js` copies are abandoned, and a landmine for anyone who wires one up.

⚠️ `next.config.ts` is an empty stub while `next.config.js` holds the real image config. Next resolves `.ts` first in some configurations — if that ever flips, **remote images break site-wide**.

**Unused-but-correct code worth keeping** (these are assets, not debt): `lib/utils/finance.ts`, `hooks/use-finance-calculator.ts`, `lib/validators/*` (zod schemas), `lib/email/templates.ts`, `types/*`.

**Root-directory clutter:** 8 one-shot codegen scripts (`build_*.cjs`, `fix_*.cjs`), 2 zoom-fix scripts, `upload-bmw-photos.js`, `supabase-setup.ps1` (the source of the SQL quoting bug), and `tatus` — a 273-byte file created by a mistyped `git status >tatus`, **committed to the repo**.

**Untracked working files that must be resolved before touching leads:** `leads-page.tsx`, `leads-page (1).tsx`, `leads-page (2).tsx`, `src/app/(admin)/dashboard/leads/page.tsx.bak`. Four near-identical copies of the same page with no indication which is canonical. `(2)` is the most advanced and fixes R2 — but ships `MOCK_ENRICHMENT` fake customer notes.

**Committed binaries:** `bmw-x5-photos/` — 19 WhatsApp JPEGs in git.

### 5.4 Stale docs

- **`README.md` is the untouched `create-next-app` boilerplate.** Zero project information. New developer onboarding is zero.
- **No `CLAUDE.md`, no architecture notes, no `docs/` directory** before this file.
- **`.env.local.example` omits `NEXT_PUBLIC_DEALER_ID`**, which `lib/data/vehicles.js:3` depends on.
- **`src/config/site.ts` ships empty contact details** with `// Paul to confirm` — the config that *should* be feeding the WhatsApp number and phone across the site is blank, which is why 9 links are hardcoded placeholders instead.
- **Stub file comments describe features that do not exist** (`vehicle-filters.tsx`: "*make, model, year, price range, fuel, transmission*"; `verification-table.tsx`: "*5-layer verification table*"). Read as a spec, not a status.
- **Commit messages overstate delivery** — `7236c95 "MILESTONE: Phase 1 core platform complete"` and `dfb4643 "Phase 1 foundation complete"` both landed while sales, reports, users, settings, photo management, and notifications were unimplemented stubs.

---

## 6. Suggested sequencing

Not requested — offered because several punch-list items are blocked by things above them.

**Before writing any code:** dump the live Supabase schema (`pg_dump --schema-only` or the Supabase dashboard) and diff against §4. Everything below assumes the real schema, not the unrunnable migrations.

1. **Stop the bleeding** — R1 (contact form), R2 (kanban statuses), R3 (WhatsApp number → drive it from `site.ts`), R14 (strip PII logging). All small, all customer-facing.
2. **Establish ground truth** — regenerate migrations from live; `npx supabase gen types typescript` to replace the placeholder `src/types/database.ts`; then remove the `@ts-nocheck` / `as any` casts and fix what surfaces (R8).
3. **Unblock daily operation** — photo upload UI wired to the existing `/api/upload` (R4); a shared error-handling helper so writes stop failing silently (R7).
4. **Unblock the commercial model** — sale records on "mark sold" (§3), which is the prerequisite for conversion reporting, team performance, and billing.
5. **Then** the remaining punch-list — lead detail views (merge `leads-page (2).tsx`'s UI, replacing `MOCK_ENRICHMENT` with real `lead_timeline` reads/writes), notifications via the already-written Resend templates.
6. **Cleanup** — resolve the middleware ambiguity (R6), delete or implement the stub component library, un-hardcode `dealer_id` (R9), fix the finance rate discrepancy (R12).

---

*Read-only audit. No source files modified; this report is the only file written. Build verified locally at `4f72ab8` on 2026-07-24.*
