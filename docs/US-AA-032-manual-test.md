# US-AA-032 — Manual test script

Verifies `/contact` and the vehicle enquiry form persist leads, and that a failure
never shows the buyer a false thank-you.

Run against **local dev** first. Every step ends by deleting the test row.

```bash
npm run dev    # http://localhost:3000
```

Set up shell vars once (values are read from `.env.local`, nothing is printed):

```bash
cd /c/Users/lenkl/WebstormProjects/autoalive1-1
URL=$(grep -m1 '^NEXT_PUBLIC_SUPABASE_URL=' .env.local | cut -d= -f2- | tr -d '\r')
SRV=$(grep -m1 '^SUPABASE_SERVICE_ROLE_KEY=' .env.local | cut -d= -f2- | tr -d '\r')
```

Record the baseline count — every test must return to it:

```bash
curl -s -I "$URL/rest/v1/leads?select=id" -H "apikey: $SRV" \
  -H "Authorization: Bearer $SRV" -H "Prefer: count=exact" -H "Range: 0-0" \
  | grep -i content-range
# Content-Range: 0-29/30   → baseline is 30
```

---

## Test 1 — `/contact` happy path (the ticket)

1. Open <http://localhost:3000/contact>.
2. Fill in: Name `ZZTEST Contact`, Phone `0821234567`, Email blank, Message `US-AA-032 test 1`.
3. Submit. **Expect:** the green "Message Sent!" panel.
4. Confirm the row actually exists:

```bash
curl -s "$URL/rest/v1/leads?select=id,first_name,last_name,phone,source,status,dealer_id,notes&notes=eq.US-AA-032%20test%201" \
  -H "apikey: $SRV" -H "Authorization: Bearer $SRV"
```

**Pass criteria** — exactly one row, with:
- `first_name` = `ZZTEST`, `last_name` = `Contact`
- `phone` = `0821234567`
- `source` = `website`, `status` = `new`
- `dealer_id` = `00000000-0000-0000-0000-000000000001`

5. Delete it (substitute the `id` returned above):

```bash
curl -s -X DELETE "$URL/rest/v1/leads?id=eq.<ID>" \
  -H "apikey: $SRV" -H "Authorization: Bearer $SRV" -w "HTTP=%{http_code}\n"
# expect HTTP=204
```

## Test 2 — single-word name (regression)

The pre-fix code sent `last_name: null`, which the NOT NULL constraint rejects.

1. On `/contact`, submit with Name `ZZTEST` (**one word**), Phone `0821234567`,
   Message `US-AA-032 test 2`.
2. **Expect:** success panel — not the error banner.
3. Confirm and delete as in Test 1, using `notes=eq.US-AA-032%20test%202`.
   `last_name` should be `""` (empty string), never null.

## Test 3 — failure path shows no false thank-you

This is the core of the ticket: a failed write must never look like success.

1. Open devtools → Network → enable **Offline** (or block `*.supabase.co`).
2. On `/contact`, fill the form and submit.
3. **Pass criteria:**
   - Red banner: "⚠️ We could not save your message." with retry wording.
   - Button reads **"Try Again →"**.
   - The green "Message Sent!" panel does **not** appear.
   - Console shows `[contact] lead insert failed` with `code`/`message` only —
     **no name, phone or email in the log**.
4. Turn networking back on, press **Try Again**. Expect success.
5. Confirm and delete the row as in Test 1.

## Test 4 — vehicle enquiry form (same pattern)

1. Open any vehicle: <http://localhost:3000/inventory> → click a card.
2. Click **Enquire Now**, submit Name `ZZTEST Vehicle`, Phone `0821234567`,
   Message `US-AA-032 test 4`.
3. **Expect:** "Enquiry Sent!".
4. Confirm the row — and that it is linked to the vehicle:

```bash
curl -s "$URL/rest/v1/leads?select=id,first_name,last_name,vehicle_id,dealer_id,source&notes=eq.US-AA-032%20test%204" \
  -H "apikey: $SRV" -H "Authorization: Bearer $SRV"
```

**Pass criteria:** `vehicle_id` is the vehicle's UUID (not null), `dealer_id` set,
`source` = `website`.

5. Repeat step 3 of Test 4 with **Offline** enabled: expect the red banner and
   **"Try Again"**, no "Enquiry Sent!", and `[vehicle-enquiry] lead insert failed`
   in the console with **no PII**.
6. Delete the test row.

---

## Final check — no residue

```bash
curl -s "$URL/rest/v1/leads?select=id,first_name,notes&or=(first_name.eq.ZZTEST,notes.like.*US-AA-032*)" \
  -H "apikey: $SRV" -H "Authorization: Bearer $SRV"
# expect: []

curl -s -I "$URL/rest/v1/leads?select=id" -H "apikey: $SRV" \
  -H "Authorization: Bearer $SRV" -H "Prefer: count=exact" -H "Range: 0-0" \
  | grep -i content-range
# expect: back to the baseline recorded at the start (30)
```

## Automated pre-checks already run

Executed during implementation, against the live database, all rows cleaned up
afterwards (verified count back to 30):

| Check | Result |
|---|---|
| Anon-key INSERT with correct columns + `dealer_id` | **HTTP 201** — browser-side insert is permitted, no server route needed |
| Replay of the shipped broken payload (`customer_*`) | **HTTP 400 `PGRST204`** — "Could not find the 'customer_email' column" |
| Correct columns, `dealer_id` omitted | **HTTP 400 `23502`** — dealer_id NOT NULL violation |
| Two-word name (`Thabo Molefe`) | **HTTP 201** |
| Single-word name, `last_name: ""` | **HTTP 201** |
| Single-word name, `last_name: null` (pre-fix behaviour) | **HTTP 400 `23502`** — confirms the regression this fix closes |
| `npx tsc --noEmit` (strict) | exit 0 |
| `npm run build` | exit 0, 22 routes |
| `npx eslint` on touched files | no new problems (all remaining are pre-existing `<a>`-nav and `@ts-nocheck` findings) |

## US-AA-032 amendment — interaction with US-AA-034 (leads RLS lockdown)

US-AA-034 removed anon SELECT on `leads` to close a PII exposure. The two public
insert paths originally chained `.select("id").single()`, which makes supabase-js
append `return=representation` to the `Prefer` header — and returning the inserted
row requires the SELECT right anon no longer has. Result: every public submission
failed with **HTTP 401 `42501`** (RLS violation) even though the INSERT policies
were intact.

Fix (app-side, no RLS change): drop `.select("id").single()` from both public
paths. Bare `insert()` sends `Prefer: return=minimal` (confirmed in
postgrest-js 2.98.0), so no SELECT is needed. The error branch is unchanged —
success is `result.error === null`; we never used the returned row.

**Joint closure probe (US-AA-032 + US-AA-034), run against live:**

| Probe (anon key) | Expected |
|---|---|
| `SELECT` on `leads` | **`[]` / `Content-Range: */0`** — no PII readable |
| `INSERT` with `Prefer: return=minimal` | **HTTP 201** — public capture works |
| `INSERT` with `return=representation` (i.e. `.select()`) | **HTTP 401 `42501`** — expected; representation needs SELECT |

Both of the first two must hold together: anon can write a website lead but read
nothing back. Delete the probe row (service role) and confirm count returns to 30.
