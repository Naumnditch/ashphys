# AshPhys — Current Project Status

**Read this first if you're a new Claude conversation picking this project up.**
This file is the source of truth for "what's actually built and where things
stand," separate from README_DEVELOPMENT.md (generic setup instructions).
Update it whenever something significant ships or changes.

Last updated: 2026-07-23 (refraction/TIR simulation)

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
- **7 interactive simulations**, each a real physics engine (not a canned
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
- **Practice engine** (IXL/Khan-style): `/practice/[topicId]`. Question-by-
  question, streak-based mastery (5 correct in a row), wrong answers surface
  a "revise this" link back to the lesson + its simulation. 40 original
  practice questions seeded across 8 lessons — 5 each for the 6 original
  sim lessons plus 5 for 13.2 (refraction) and 5 for 13.3 (TIR).
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
