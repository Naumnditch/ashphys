# AshPhys — Current Project Status

**Read this first if you're a new Claude conversation picking this project up.**
This file is the source of truth for "what's actually built and where things
stand," separate from README_DEVELOPMENT.md (generic setup instructions).
Update it whenever something significant ships or changes.

Last updated: 2026-07-27 (Shopier: callback rewritten to match REAL OSB contract from official example code)

---

## Live site

- Production: **www.ashphys.org** (aliases: ashphys.org, ashphyss.vercel.app)
- Owner/admin login: `naumnditch572@gmail.com` (role=admin in the `users` table)
- GitHub (code, push here): `github.com/Naumnditch/ashphys.git` → branch `main`
- GitHub (Vercel actually watches this one — **double s**): `github.com/Naumnditch/ashphyss.git` → branch `master`
- Standard deploy command from repo root:
  `git push origin main && git push ashphyss main:master --force`
- Supabase project: `ashphys-platform` (id `uolwvcszclviqrtyxwgl`, eu-central-1)
- Vercel project: `ashphyss` (id `prj_7lk98vPTJcP5ScK1syAZA0aPgTNV`), team `abdelrahman-elashmawys-projects`

## What's fully built and live

- **Homepage / positioning**: platform-first, not tutoring-first. Markets
  AshPhys as the only place needed to study physics, across IGCSE (marked
  "Available Now" — the only one with real content), IB and HMH (marked
  "Coming Soon" — honest, not yet built). Live stats and pricing tiers
  pulled from the DB, not hardcoded. Private tutoring is now a Pro-tier
  subscription perk, not a standalone headline CTA — `/book` still works,
  just isn't featured in the navbar anymore.
- **Curriculum**: 25 chapters, 89 lessons, matching the real Cambridge IGCSE
  Physics (0625) textbook table of contents. Browsable at `/curriculum`,
  navbar has a dropdown too. Full-text site search in the navbar
  (`/api/search`) covers chapters, lessons, and simulations.
- **13 interactive simulations**

### Shopier payment integration (NEW - awaiting API keys from user)
- Shopier is NOT REST/JSON - it's a classic form-post gateway. Browser
  is redirected with a signed HTML form to
  https://www.shopier.com/ShowProduct/api_pay4.php; Shopier POSTs the
  result back to ONE callback URL configured inside the Shopier panel
  itself (Ozellestirmeler > API Bilgileri > Geri Donus URL) - NOT a
  per-request field, NOT an env var. That URL must be set to
  https://ashphys.org/api/payments/shopier/callback inside Shopier's
  own dashboard by the user - Claude cannot do this part.
- Signature (both directions): base64(HMAC-SHA256(random_nr +
  platform_order_id + total_order_value + currency_code, api_secret)).
  Reverse-engineered from Shopier's own PHP examples (no official
  public spec exists) - self-verified round-trip in node (44-char b64,
  32-byte digest) before shipping.
- lib/shopier/client.ts: buildShopierFormFields, verifyShopierCallback
  (timingSafeEqual), generatePlatformOrderId/generateRandomNr.
  currency codes are Shopier's own (TRY=0, USD=1, EUR=2), NOT ISO 4217.
- DB table shopier_orders: platform_order_id (unique), student_id,
  plan_id, billing_cycle, is_test, amount, currency, random_nr,
  status (pending/success/failed/cancelled), shopier_payment_id,
  installment, raw_callback jsonb.
- POST /api/payments/shopier/checkout (admin-only for now): creates a
  pending order, returns signed form fields for the client to
  auto-submit (real form POST, not fetch - Shopier's gateway requires
  an actual browser form submission).
- POST /api/payments/shopier/callback (PUBLIC - Shopier calls this
  directly, no session): verifies HMAC before touching anything,
  updates the order, logs to payment_logs, and on a REAL (non-test)
  success upserts the subscriptions row (ON CONFLICT student_id,
  extends end_date by 1 or 12 months per billing_cycle). This URL is
  BOTH the server notification AND the page the shopper's browser
  lands on, so it redirects to /payments/result?status=...&orderId=...
  rather than returning JSON.
- /payments/result: public results page, reads the order from DB,
  shows success/failure with order details.
- /admin/test-payment + components/admin/TestPaymentPortal.tsx:
  amount input (default 1.00 TRY), hidden auto-submit form pattern.
  Explicitly warns there is no Shopier sandbox - any test is a REAL
  charge.
- CREDENTIAL LOCATION RESOLVED (2026-07-27): NOT under
  Ozellestirmeler > API Bilgileri (that menu doesn't exist in current
  Shopier UI) and NOT the "Kisisel Erisim Anahtari" / PAT under Hesap
  Yonetimi (that's a SEPARATE newer developer/app-store platform,
  issues a single token, unrelated to the payment gateway - confirmed
  by screenshot, user had already generated one for something else).
  The actual pair lives under Ek Ozellikler > Siparis Bildirimi
  (Otomatik Siparis Bildirimi / OSB) screen: "OSB Kullanici Adi" =
  SHOPIER_API_KEY, "OSB Sifresi" = SHOPIER_API_SECRET. Same screen has
  the Bildirim URL field (protocol dropdown + URL) where
  ashphys.org/api/payments/shopier/callback must be pasted and saved -
  this IS the panel-side callback config, just relocated from where
  older guides describe it. Screen shows a banner that OSB is a
  legacy feature vs newer Webhooks - fine for now, revisit if Shopier
  actually deprecates it. User has now located + saved both.
- BUG FOUND AND FIXED (2026-07-27): TestPaymentPortal's auto-submit
  used setTimeout(fn, 0) after setFields/setPaymentUrl to submit the
  hidden form - a real race against React's render commit. If the
  timeout fired before the form existed in the DOM,
  formRef.current?.submit() was a silent no-op (optional chaining
  swallows the null case) - button stuck forever on "Redirecting to
  Shopier..." with zero error, exactly what the user hit. Also that
  button text was misleadingly shown the INSTANT the button was
  clicked (loading=true), before the checkout API call had even
  returned, so it didn't distinguish "waiting on our server" from
  "actually navigating." Fixed: submit only inside a useEffect keyed
  on [fields, paymentUrl], which React guarantees runs after DOM
  commit; separated `loading` (server call in flight -> "Starting
  checkout...") from `redirecting` (form found + submit fired ->
  "Redirecting to Shopier...") so a stuck state is now diagnosable.
- BUG FOUND AND FIXED #2 (2026-07-27): callback route was responding
  to Shopier with an HTTP redirect (3xx) to /payments/result, which
  works fine for a real browser but almost certainly fails Shopier's
  OSB test tool / any server-to-server notification check, since those
  virtually never follow redirects and just check the immediate status
  code. Rewrote to ALWAYS return 200 OK (a resultPage() helper: 200 +
  a tiny HTML body with a meta-refresh, so a real shopper's browser
  still lands on /payments/result, but Shopier's automated check sees
  200 immediately). Also added a GET handler returning plain 200 OK,
  in case their test pings with GET before/instead of POST - genuinely
  unknown which method OSB uses, no public spec exists. Unknown-order
  callbacks (e.g. for purchases made through Shopier's own storefront
  rather than our API) now also return 200 rather than erroring, since
  there's nothing wrong with not recognizing an order we didn't create.
- UNRESOLVED: 509 "Dukkanda siparis olusturulamamaktadir" still blocks
  checkout via api_pay4.php entirely - confirmed NOT a signature/code
  problem (Shopier's own branded error page renders, meaning the
  request reached their server and was parsed; a bad signature shows a
  different, more specific error per other users' reports). Dashboard
  diagnostics so far: Hesap Ozeti shows "null adet" for Toplam Siparis
  (a raw placeholder leaking through - suggests incomplete account
  setup) and 0.00 across all sales figures. Checked Dukkan Yonetimi
  submenu, no obvious "register my own website for API payments" entry
  found. Working theory: either (a) account still mid-activation
  (Shopier docs mention up to 24h approval after signup, and mention a
  step during onboarding to declare "Kendi Internet Sitem" as the
  payment channel - unclear if this user's account completed that
  step), or (b) some other account-level gate. User has emailed
  hello@shopier.com with the error code; awaiting their reply is
  probably the fastest path now rather than more menu-guessing.
  IMPORTANT: user also completed a real 10 TL purchase of the
  "ashphys kurs" product via Shopier's own native storefront (NOT via
  our API) specifically to generate a real order number (307538405)
  for the OSB test tool - that product/order exists in their Shopier
  account, unrelated to our shopier_orders table.
- MAJOR CORRECTION (2026-07-27): user pasted Shopier's own "OSB ornek
  kodunu goruntule" PHP example code (first-party, from inside their
  panel - NOT reverse-engineered like everything else researched this
  session). It revealed the callback contract was completely wrong:
    * incoming fields are just `res` (base64 JSON) + `hash` - NOT the
      7-field classic-gateway shape (status/platform_order_id/
      payment_id/random_nr/total_order_value/currency/signature) that
      was built from reverse-engineered gists/PHP SDKs
    * hash = HEX hmac_sha256(res + OSB_USERNAME, key=OSB_SECRET) - hex
      output (raw_output=false in PHP), NOT base64, and signs
      `res+username` not a field concatenation
    * only fires on SUCCESS - no status field to branch on at all
    * the ONLY valid acknowledgement is the literal plain-text string
      "success" - not JSON, not HTML, not "OK". This explains why the
      earlier 200-with-meta-refresh-HTML fix likely still failed the
      OSB test even though the status-code part was right.
  Rewrote lib/shopier/client.ts (verifyOsbHash, decodeOsbPayload
  replacing the old verifyShopierCallback/ShopierCallbackFields
  entirely - confirmed unused elsewhere before deleting) and the whole
  callback route to match exactly: reads res+hash, hex HMAC verify,
  decodes base64 JSON payload {email,orderid,currency,price,
  buyername,buyersurname,productcount,productid,productlist,
  chartdetails,customernote,istest}, responds with EXACTLY "success"
  (plain text, 200) on valid signature, "missing parameter"/""/"bad
  payload" otherwise (mirroring the PHP example's own responses).
  Self-verified the hex HMAC translation in node (64-char valid hex,
  matches hash_hmac(...,false) semantics exactly).
  IMPORTANT ARCHITECTURE CORRECTION: this URL is NOT also the page a
  shopper's browser lands on after paying (that was a wrong assumption
  carried from older classic-gateway docs) - OSB is a pure
  server-to-server notification. The /payments/result page built
  earlier is now unreferenced/orphaned - harmless, left in place, not
  cleaned up.
  ORDER CORRELATION CAVEAT: whether Shopier's `orderid` in the OSB
  payload equals the `platform_order_id` WE supply when creating an
  order via api_pay4.php is UNCONFIRMED - no successful api_pay4.php
  order has occurred yet (509 still blocks it). Callback tries to
  match by platform_order_id and gracefully logs+acknowledges
  regardless if no match is found (e.g. native-storefront purchases
  like the manual "ashphys kurs" test buy). Revisit this mapping once
  a real order actually completes.
  STILL SEPARATE AND UNRESOLVED: the 509 "Dukkanda siparis
  olusturulamamaktadir" checkout-creation error. This OSB fix only
  addresses the notification/acknowledgement contract - it does NOT
  fix order creation via api_pay4.php. Leading theory remains the
  Entegrasyonlar > Modul Yonetimi > Kayitli Alan Adlari domain
  registration step (user has not yet confirmed checking this).
- STILL TODO once confirmed working: wire a real (non-admin) student
  checkout flow using subscription_plans pricing instead of the
  admin-only test amount; payment_logs currently writes NULL for
  subscription_id on test charges (intentional, no subscription to
  attach) and the iyzico_payment_id column is reused to store the
  shopier payment_id (no schema rename attempted - it's a generic
  external-payment-id column despite the name).

### Momentum practice questions with diagrams (NEW)
- `question_image_url` column existed in schema but was never wired to
  the frontend before this session - now is, end to end.
- Diagrams are ORIGINAL SVG, drawn as React components (not external
  image files) - components/practice/MomentumDiagrams.tsx. Referenced
  from question_image_url as an internal key like
  "diagram:momentum-stick-1" rather than a URL; PracticeSession.tsx
  checks the "diagram:" prefix and renders <MomentumDiagram> for those,
  falls back to a plain <img> for any real external URL (so the column
  stays generically useful later). No file hosting needed for these.
  Diagram style: trolley rectangles on wheels, BEFORE/AFTER panels
  split by a dashed divider, teal arrows for given velocities, brass
  for the unknown-being-solved-for in the after panel (red-tinted).
  8 diagram keys built: momentum-stick-1/2, momentum-explosion-1,
  momentum-separate-1, momentum-headon-1, momentum-recoil-1,
  momentum-wall-1, momentum-oblique-1.
- 8 questions seeded across topic 3.5 Momentum (problems 6,7,8,9,11:
  sticking collision both directions solved-for, explosion/recoil,
  non-sticking separate velocities, gun recoil) and topic 3.6 Vectors
  (problems 10,12,13: head-on opposite-direction collision, wall
  bounce momentum-CHANGE with the subtract-speeds-not-momenta trap,
  oblique collision with sign-handling on both sides). All 8 verified
  independently via node arithmetic before shipping. Chapter 3
  previously had problems 1-5 (Newton's second law sim); now 1-13
  (skipped nothing, just picked next available numbers 6-13).

### Past Papers section (NEW - infrastructure only)
- COPYRIGHT NOTE: Cambridge explicitly does not permit hosting past
  exam papers on third-party websites (confirmed via their own help
  centre). User made an informed decision to proceed as a "mirror"
  (like Save My Exams etc) at their own risk. Claude built ONLY the
  infrastructure - schema, admin CRUD, public browsing page - and
  declined to personally source/reproduce any real exam content.
  User uploads their own PDFs (paste URL after hosting elsewhere -
  no file-upload pipeline built, no Supabase Storage wired up yet).
- DB table `past_papers`: syllabus_code (default '0625'), year
  (>=2020), session (Feb/Mar | May/Jun | Oct/Nov), paper_number (1-6),
  variant (1-3), question_paper_url, mark_scheme_url,
  explanation_status (coming_soon|published), explanation_video_url
  (YouTube link - YOUTUBE_API_KEY already in .env.example),
  explanation_notes. Unique on (syllabus_code, year, session,
  paper_number, variant).
- Public page `/past-papers`: year+paper-number filter pills, grouped
  by year/session, lab-notebook styling. "Explanation: Coming Soon"
  badge when no video; QP/MS show as greyed-out labels (not links)
  when url is null - never a broken link.
- Admin `/admin/past-papers`: form to add/update by
  year/session/paper/variant (upsert on the unique key), list with
  edit/delete. API routes: POST+GET /api/admin/past-papers, DELETE
  /api/admin/past-papers/[id]. Same admin-only auth pattern as
  teacher-applications.
- UPLOAD PIPELINE (added this session): Supabase Storage bucket
  `past-papers` created directly via SQL against storage.buckets
  (public=true, 20MB limit, application/pdf only — no supabase-js
  dependency added, matches the project's raw-pg-only style). New
  route POST /api/admin/past-papers/upload (multipart file + path) ->
  Storage REST API (POST .../storage/v1/object/past-papers/<path>)
  using SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (server-side only,
  bypasses RLS) -> returns the public URL
  (.../storage/v1/object/public/past-papers/<path>). Admin form's URL
  text inputs replaced with file pickers that upload on selection and
  auto-fill the URL field; path is auto-slugged from
  year/session/paper/variant (e.g. 2020-oct-nov/paper-4-v2-qp.pdf).
  BLOCKED ON USER: SUPABASE_SERVICE_ROLE_KEY is a secret Claude has no
  MCP access to (by design) — user must copy it from Supabase
  dashboard (Project Settings > API > service_role) into Vercel env
  vars alongside SUPABASE_URL (already known:
  https://uolwvcszclviqrtyxwgl.supabase.co), then redeploy, before
  upload buttons will work in production. .env.example updated with
  both vars and the exact project URL.
  COPYRIGHT NOTE STILL APPLIES: Claude built the pipeline but does
  not upload any real exam content itself — user uploads their own
  legitimately-downloaded PDFs through this form.
- ONE TEST ROW seeded: 2020 Oct/Nov Paper 4 Variant 2, metadata only
  (no QP/MS urls, explanation_status='coming_soon'). Waiting on user
  to paste in their own real PDF links via the admin form to complete
  the test, then confirm before bulk-importing sessions since 2020.
- STILL TODO if user confirms: bulk-import UI/script for many papers
  at once (currently one-at-a-time only), file-upload-to-storage
  pipeline (currently URL-paste only, no Supabase Storage bucket
  wired up), YouTube embed player on the public page (currently just
  a link out) instead of iframe embed., each a real physics engine (not a canned
  animation), registered in the `simulations` table with a `topic_id` linking
  it to its exact lesson:
  - `/simulations/pendulum` — damped oscillation, force vectors, technical overlay
  - `/simulations/distance-time-graph` — kinematics, live graph tracing
  - `/simulations/spring` — Hooke's law, permanent deformation, hot-color stress
  - `/simulations/newtons-second-law` — F=ma, velocity-time graph
  - `/simulations/ohms-law` — circuit with animated current flow, V-I graph
  - `/simulations/circuit-builder` — real nodal-analysis solver (Gaussian
    elimination), grid-based drag-and-place circuit sandbox
  - `/simulations/refraction` — optics bench for 13.2/13.3: live Snell's law,
    draggable ray box on a protractor, Fresnel intensity split (reflected ray
    brightens toward the critical angle), animated wavefronts that slow and
    compress in the denser medium, and a record-your-own sin i vs sin r plot
    that fits n from the gradient. Registered under topic 13.2; enum
    `sim_type` gained an 'optics' value (migration add_optics_sim_type).
  - `/simulations/balance-beam` — moments practical for 4.1/4.2: metre rule
    on a draggable pivot, drag-and-stack weights at 5 cm notches, real
    rotational dynamics (I·alpha = net torque, lever arms shorten with tilt,
    end stops), live CW/ACW moments ledger, adjustable beam mass at its
    centre of gravity ("find the mass of the ruler"), and a mystery-mass
    challenge. Registered under topic 4.2, sim_type 'force_diagram'.
  - `/simulations/ripple-tank` — the 2D wave equation (FDTD, 176x104 grid,
    120 steps/s) for 14.1-14.3: seven scenes (plane waves, angled reflector,
    narrow/wide gap diffraction, Young double slit, refracting shelf,
    two-point interference),
    stroboscope, absorbing beach edges, 10 cm measuring grid. Scaled to a
    real tank: v = 30 cm/s deep / 18 cm/s shelf. Reflection/diffraction/
    refraction all EMERGE from the solver, nothing scripted. Registered
    under topic 14.3. Numerics verified against numpy (lambda within ~3%
    of v/f; grid dispersion). Engine details that matter: beaches use
    VELOCITY damping (-gamma*u_t) - a naive multiplicative decay on
    displacement reflects badly (~50%+); measured wall echo now ~1% via
    detrended standing-wave-ratio test. Source is a SOFT (additive)
    full-height dipper line at x=10 with a strong absorber housing behind
    it: launches one-way left-to-right, transparent to returning waves
    (a hard source line makes the tank a resonant cavity). Playback speed
    control (1/4x, 1/2x, 1x) via a substep accumulator.
  - `/simulations/double-slit` — Young companion (14.3 extension),
    REBUILT per user feedback to be the same wave engine as the ripple
    tank (the first light-based version auto-scaled the view so the a/D
    sliders visibly did nothing). Now: the a slider physically moves the
    slits, the D slider physically moves a detector line, f is the
    wavelength dial. A detector integrates the wave field along the
    screen and MEASURES fringe spacing, displayed as a three-way
    comparison: formula x = lambda*D/a vs exact path-difference theory
    (bisection, no small-angle) vs measured. Node-verified: in the
    strained regime (a=20, D=15) formula says 3.8 cm, exact says 5.0,
    field measures 5.0 - the sim validates wave theory and exposes the
    formula's far-field small print. Second sim under topic 14.3; the
    chapter page was upgraded to group sims per topic (was a Map that
    silently overwrote; now one labelled button per sim).
  - `/simulations/gas-laws` — Gas in a Box (9.3 & 9.5, registered under
    topic 9.5 aedaea73): hard-disc molecular dynamics, N up to 280 with
    pairwise elastic collisions. Pressure is MEASURED from wall-impulse
    accounting (nothing scripted); node-verified pV constancy 97.7%
    across full compression and pressure law ratio 3.09 vs 3.00. Physics
    radius R=2 chosen deliberately: R=3 gave 90% constancy from excluded
    volume (real-gas effect). Draggable piston with moving-wall
    reflection (2u_p - v) -> honest adiabatic heating on fast
    compression, soft bath thermostat (rate 0.02/substep) relaxes back.
    Dial gauge, thermometer (bath setpoint vs measured T_kin), live p-V
    chart with theory isotherm + measured trail, speed-coloured
    particles, technical overlay = emergent Maxwell-Boltzmann histogram
    vs Rayleigh curve. sim_type enum has no 'particle' - used
    'collision'. THREE MODES: Boyle (kinematic piston, p-V chart vs
    isotherm), Pressure Law (fixed V, p-T chart, line through absolute
    zero), Charles (overdamped free piston v = 0.025*(p_gas-p_ext)*H
    clamped +-60, node-verified V/T constant +-3% and settle within
    2-8% of V=NkT/p_ext; p_ext slider 10-26; V-T chart through origin).
    Trail is mode-aware {x,y}; formula card/hints/Try This switch per
    mode. 15 questions seeded (ch9 problems 1-15: 5x topic 9.3, 10x
    topic 9.5 incl pressure law, Charles, kelvin, absolute zero).
  - `/simulations/half-life` — Half-Life Lab (23.2 & 23.3, registered
    under topic 23.3 97e38b4a): stochastic decay, each nucleus rolls
    P = 1 - e^(-lambda*dt) per frame (exact), nothing exponential
    programmed. Grid of 100/400/900 brass nuclei with decay flashes,
    one ringed 'watched' nucleus (unpredictability), measured N-t curve
    vs dashed theory N0*2^(-t/T-half), red dots + printed intervals at
    each measured halving, live activity counter (1s sliding window),
    technical overlay compares measured activity vs lambda*N. sim_type
    'graph_builder'. Chapter 23 questions seeded (problems 1-10: 5x
    topic 23.2, 5x topic 23.3).
  - `/simulations/pressure-in-liquids` — p = rho*g*h bench (5.4 & 5.5,
    registered under topic 5.5 5c5e1c9b): 2 m tank, draggable probe
    whose measurements land as colour-tagged dots on a live p-h chart
    (persist across liquid switches for slope comparison), 5 liquids,
    3 gravities (Moon/Earth/Jupiter), gauge-vs-absolute toggle
    (+101.3 kPa), Torricelli wall spouts at 0.5/1.0/1.5 m with
    v = sqrt(2gh) droplet jets (analytic kinematics, no engine).
    Technical panel notes the rho-independence of jet speed. sim_type
    'force_diagram'. Ch5 questions extended: problems 6-15 (5x topic
    5.4 conceptual, 5x topic 5.5 calculations); ch5 problems 1-5 were
    the spring sim's.
  - Layout: ripple-tank, double-slit, gas-laws, half-life, and pressure-in-liquids pages use a full-width layout
    (max-w-[1600px], canvas card full width, notebook cards in a
    lg:grid-cols-3 row below). Older sims keep the two-column layout.
- **Practice engine** (IXL/Khan-style): `/practice/[topicId]`. Question-by-
  question, streak-based mastery (5 correct in a row), wrong answers surface
  a "revise this" link back to the lesson + its simulation. 65 original
  practice questions seeded across 13 lessons — 5 each for the 6 original
  sim lessons, 13.2/13.3 (refraction/TIR), 4.1/4.2 (moments), and all of
  chapter 14 (14.1/14.2/14.3, waves).
  Green "🎯 Practice" button appears on chapter pages for lessons that have
  questions.
- **Teacher accounts**: signup requires school name + message, starts
  `status='inactive'` pending approval. `/teacher/pending`, `/teacher/dashboard`
  (sections, join codes), `/teacher/sections/[id]` (roster).
- **Admin portal**: `/admin` (overview stats), `/admin/users` (search, role/
  status editing), `/admin/sections` (all sections, any teacher),
  `/admin/curriculum`, `/admin/teacher-applications` (approve/reject).
- **Student class join**: `/dashboard/join-class`, enter a teacher's code.
- **Auth**: httpOnly cookie (not just localStorage) + `lib/auth/session.ts
  getCurrentUser()` for Server Components — this is what every protected page
  and the Navbar's login-aware state runs on. Self-service password reset at
  `/auth/forgot-password` (token-based, 1hr expiry) — SMTP isn't configured
  yet, so it falls back to showing the reset link directly on-screen instead
  of pretending to email it.
- **Subscription tiers** (data model + pricing decided, no UI or payment
  wiring yet): `subscription_plans` table seeded with Free / Plus (99 TRY/mo,
  999/yr) / Pro (179 TRY/mo, 1799/yr) — see that table for exact features.
  All hypothetical, easy to change before real money is involved.

## Explicitly NOT built yet

- **`/pricing` page** — tiers exist in the DB, no frontend for them yet.
- **Iyzico payment integration** — blocked on the user's merchant application
  being approved (was in review as of 2026-07-21) and them providing API
  key + secret (sandbox is fine to start). Do not attempt to fabricate
  credentials or "test" this without real ones.
- **Quizzes / timed exams with lockdown mode** — discussed and scoped
  (fullscreen-required, tab-switch detection, auto-submit on violation,
  violation log for teachers) but not started. Honest technical ceiling:
  browser-based lockdown can detect and log violations, it cannot make
  leaving the tab physically impossible — that needs a native app, which is
  out of scope.
- **Real past-exam content** — explicitly will never "import" actual
  Cambridge past papers (copyright). Only original questions, written fresh.

## Known gotchas worth knowing before touching this repo

- **Escape sequence bug**: typing `\uXXXX` unicode escapes (e.g. `\u2019` for
  a curly apostrophe) into `file_text`/`new_str` params has repeatedly landed
  as a literal double-backslash in the actual file, breaking the character
  instead of rendering it. Always type the literal Unicode character directly
  (´ ’ Ω Δ · —, etc.), never `\u` escapes. Scan for `u2019|u0394|u00B2|u2014|
  u2212|u03A9` etc. before every deploy — this has bitten nearly every
  simulation file at least once.
- **Two GitHub repos**: pushing only to `ashphys` does nothing on the live
  site — Vercel watches `ashphyss` (double s). Always push both.
- **`tsc --noEmit` isn't enough** for anything nontrivial — it's passed clean
  while real Next.js builds still failed on things like the Google Fonts
  network call this sandbox can't reach. Standard workaround: temporarily
  stub the Inter font import in `app/layout.tsx`, run `npm run build`, then
  restore the file before committing (never commit the stub).
- **information_schema queries need `table_schema='public'`** — Supabase's
  `auth.users` table has the same name as the app's `public.users` and will
  silently pollute results otherwise.
- Local `bash_tool`/`view`/etc. have had at least one real outage during
  development (tools returning "not found" for an extended period, unrelated
  to Vercel/GitHub/Supabase all being healthy). If that happens: the actual
  infrastructure (GitHub/Vercel/Supabase) is a separate concern from sandbox
  tool availability — check them independently rather than assuming one
  implies the other.

## Design language

Two distinct visual systems, intentionally:
- **Main site** (dashboards, auth, curriculum, admin): clean minimalist
  black/white/serif, Tailwind grays + blue-600 accent, matches the original
  AshPhys brand.
- **Simulations**: a separate "lab notebook" palette — warm paper background
  (#faf7f0), graph-paper grid, ink navy (#1b2a41), brass (#b8823d), teal
  (#2e7d6b), danger red (#b34a3c), plus violet/blue/magenta accents per-sim.
  Consistent across all 6 sims on purpose so the simulations section reads
  as one product.

## Booklets section (2026-08-28)
- School banned foreign books — user/teacher now writing original booklets
  per chapter/lesson themselves. No copyright concern (own content).
- Same architecture as past-papers, cloned directly: Storage bucket
  `booklets` (public, PDF-only, 50MB cap — larger than past-papers'
  20MB since teacher booklets may be more image-heavy), table `booklets`
  (chapter_id required, topic_id nullable — null means whole-chapter
  booklet, set means lesson-specific booklet, so both granularities
  the user asked about are supported from one table).
- Admin `/admin/booklets`: chapter dropdown -> topic dropdown (filtered
  to that chapter, "Whole chapter" option) -> title/description -> file
  picker that uploads on selection and auto-fills file_url + tracks
  file_size_bytes. Storage path auto-slugged:
  chapter-<N>/<lesson-slug>/<title-slug>.pdf (or chapter-<N>/<title-slug>.pdf
  for whole-chapter booklets).
- Public `/booklets`: grouped by chapter number, lab-notebook styling
  matching past-papers/simulations. Only shows booklets with a real
  file_url (no placeholder/dead links). Direct download links,
  target=_blank.
- Capacity check done this session: DB usage 12MB/500MB free tier
  (2.4%, booklets add negligible metadata). Storage usage 0 bytes
  (nothing uploaded yet through any pipeline, past-papers included).
  Recommended Pro tier ($25/mo, 100GB storage) once booklets + past
  papers are both actively used — free tier's ~500MB-1GB could get
  tight with 89 lesson-level booklets at realistic sizes, Pro tier
  removes the question entirely.
- Nav links added (Navbar + AdminNav).
- SESSION NOTE: this session's sandbox container had NO prior state
  (fresh container, not a lost-work situation) - re-cloned from GitHub
  successfully with the existing token; full git history intact
  through commit 9e4bfe6. Token still active as of this session -
  standing reminder to revoke stands.

## Prep Physics chapter (2026-08-28)
- New chapter 0 "Prep Physics" (id 683a1a72-6900-4e3c-a063-dca54eb50d4a),
  chapter_number=0/order=0 so it sorts above chapter 1 without renumbering
  the other 25. course_id matches all other chapters (single course row).
- 8 topics seeded (order 1-8): Rearranging Equations (6cb3f4b2...),
  Standard Form & Sig Figs (04575a57...), Unit Prefixes (12a38624...),
  Constant of Proportionality (1f4e68db...), Reading/Interpreting
  Graphs (235adaf3...), Basic Trig for Physics (0e3dc753...), Geometric
  Projections (87127372...), Order of Magnitude & Estimation
  (d4129957...). User explicitly wants a simulation for EACH ("that is
  VIP") - building one at a time, user reviews between each per their
  stated preference.
- `/simulations/equation-rearranger` (1st of 8, topic "Rearranging
  Equations") SHIPPED: NOT a physical simulation - a guided algebra
  trainer, deliberately different genre from every other sim on the
  platform since the skill itself is symbolic manipulation, not a
  phenomenon to model. 13 challenges across 6 real IGCSE formulas
  (F=ma, rho=m/V, V=IR, P=E/t, p=rho*g*h, v=u+at), 1-2 steps each.
  Step-by-step: student picks the correct legal operation from a
  randomized-position pair (correct vs decoy), decoy always has a
  specific written explanation of why it fails (not just "wrong").
  On full isolation: editable "verify with numbers" panel computes
  the target BOTH via the original relationship and the derived
  final formula from the same sample values, shows them agreeing live.
  All 13 rearrangements independently verified in node before writing
  any UI code (6 equation families, spot-checked with real numbers).
  sim_type 'graph_builder' (reused, no better enum value exists -
  same workaround as gas-laws needing 'collision').
- REMAINING 7 sims for this chapter, not yet built: Standard Form &
  Sig Figs, Unit Prefixes, Constant of Proportionality, Reading Graphs,
  Trig for Physics, Geometric Projections, Order of Magnitude. Topics
  already exist in DB and show on /curriculum now (chapter 0, at the
  top) even before their sims ship - curriculum page already supports
  chapters/topics with no sim yet (shows no "Launch Simulation" button
  until one is registered against that topic_id).
