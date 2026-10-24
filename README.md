# DekhoCampus Online

DekhoCampus Online is an independent discovery and counselling marketplace for online degrees in
India. It separates broad directory coverage from intake-level verified offerings so learners can
explore freely without treating a university name, fee estimate or marketing claim as current
regulatory proof.

## What is included

- Responsive light and dark experiences for course, university and specialisation discovery.
- Search, a four-step private degree finder, saved comparisons and a catalogue-grounded copilot.
- Detailed university and university-programme pages with visible evidence states.
- Consent-aware counselling requests with one user-selected response channel.
- An invite-only administration area for universities, programme templates, intake offerings,
  specialisation availability, claim evidence, leads and site settings.
- Public methodology, privacy, terms and accessibility pages plus sitemap and robots controls.

## Local development

Use Node.js 22 and npm.

```sh
npm ci
cp .env.example .env
npm run dev -- --host 127.0.0.1 --port 8086
```

Cloudflare D1 and R2 are supplied through Wrangler bindings, so no database or storage credentials
belong in the browser environment. Copy `.env.example` only for the public Turnstile key and local
server-secret placeholders.

To preview the built Cloudflare Worker locally, build first and then start the Worker-compatible
preview (the standard Vite preview server cannot run this Nitro output):

```sh
npm run build
npm run preview -- --port 8087
```

The production Turnstile site key is restricted to `online.dekhocampus.com`, so it must not be
relaxed to make localhost work. Use Cloudflare's published test site/secret key pair in an untracked
local environment when exercising the complete enquiry flow locally.

## Quality commands

```sh
npm run typecheck
npm run lint
npm run build
npm run check
```

The CI workflow runs the combined check on every main-branch push and pull request.

## Cloudflare deployment

The production target is a Cloudflare Worker with static assets and TanStack Start SSR. Public
build-time values live in `.env.production`; sensitive values are encrypted Worker secrets.

```sh
npm ci
npm run db:migrate
npm run catalogue:import
npm run assets:migrate
npm run deploy:dry
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put LEAD_BUCKET_SECRET
npm run deploy
```

`wrangler.jsonc` owns the Worker name, account, runtime bindings and the
`online.dekhocampus.com` custom domain. Never add server secret values to that file or to a
`VITE_` variable. The production zone also has an active, hostname-scoped rate-limit rule for
`POST /api/leads`; keep that rule in place when changing the lead endpoint.

## Catalogue model

The public experience distinguishes three different concepts:

1. A university profile.
2. A reusable degree category such as MBA or BBA.
3. A university-specific offering for one delivery mode and academic session.

New CMS records default to unpublished or unverified. A current offering requires its exact
programme name, Online/ODL mode, academic session, primary evidence URL, verification time and next
review time. Total fee, semester fee and monthly payment each have separate evidence flags. Missing
values are not silently replaced with plausible-looking amounts.

Bundled directory profiles keep the local discovery experience useful while the CMS is being
populated. They are clearly labelled, excluded from rankings and exact-price comparisons, and their
thin programme pages are kept out of search indexing until intake-level evidence exists.

## Cloudflare data and media

- `CATALOG_DB` is the D1 database for universities, courses, offerings, specialisations, leads,
  catalogue research and site settings. Apply `migrations/0001_cloudflare.sql` with
  `npm run db:migrate`.
- `ASSET_BUCKET` is the private R2 bucket. Public media is served through `/media/*` by the Worker
  with immutable browser and edge caching; the browser never receives an R2 credential.
- `npm run catalogue:import` validates and imports the reviewed catalogue handoff into D1.
- `npm run assets:migrate` verifies each bundled logo checksum before uploading it to R2.
- Protect `/admin*` and `/api/admin*` with a Cloudflare Access self-hosted application. Allow only
  verified staff identities; the Worker also requires the Access assertion header in production.

The old Supabase project is not used at runtime. Keep it read-only until historical leads and media
have been reconciled, then retire it separately.

## Reference release — October 2026

The current release serves the reviewed bundled catalogue and 22 editorial guides at `/news` and
`/news/:articleSlug`. Category pages include the full education taxonomy; topics without published
articles show an explicit empty state. A WordPress/news publishing integration is not connected.

Production lead intake uses the dedicated `dekhocampus-online` D1 database. Historical Supabase
records are not deleted or imported automatically. Keep that project available until reconciliation.

R2 is disabled in the current Cloudflare account. With the owner's approval, university logos,
photographs and guides ship as cached Worker static assets. Known legacy logo media URLs redirect
to their bundled equivalents. R2 upload/migration commands are deferred until the account enables R2.

Admin routes fail closed unless `ACCESS_TEAM_DOMAIN` and `ACCESS_POLICY_AUD` identify a staff-only
Cloudflare Access application. The Worker verifies the JWT signature, issuer, audience and expiry;
merely sending a `Cf-Access-Jwt-Assertion` header does not grant access.

## Free-tier operating envelope

This deployment can have zero additional monthly platform cost while it remains inside the
Cloudflare Free-plan quotas. The existing Lightsail instance, domain registration, email/SMS/CRM and
any paid WordPress plugins are separate costs. Free plans are hard capacity limits, not a guarantee
that a traffic spike will continue to be served, so monitor Worker, D1 and R2 usage before campaigns.

## Release gates

Before production launch:

1. Create the D1 database and R2 bucket in the production Cloudflare account, replace the temporary
   D1 database identifier in `wrangler.jsonc`, then apply and import the data before deployment.
2. Configure Cloudflare Access for `/admin*` and `/api/admin*`, allowing only verified staff email
   addresses. Public sign-in never grants administrative access.
3. Complete an intake-by-intake editorial backfill. Legacy universities and offerings are
   unpublished and hidden by
   the public catalogue until their exact current evidence is added.
4. Verify the exact university, programme, delivery mode and session on the official UGC-DEB source;
   verify fees separately on the university's official source.
5. Configure a hostname-restricted Cloudflare Turnstile widget and set
   `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_ALLOWED_HOSTNAMES` and a separate
   random `LEAD_BUCKET_SECRET` of at least 32 characters. The
   same-origin `/api/leads` endpoint rate-limits before parsing, validates every production token,
   sends only an HMAC-derived client bucket to D1, and never exposes a direct database API.
   Also configure a Cloudflare rate-limiting rule for `/api/leads` because the in-process limiter is
   intentionally only a first line of defence across distributed edge isolates. Configure OTP/DLT
   consent where applicable, CRM assignment, communication suppression and withdrawal handling
   before outbound campaigns.
6. Replace catalogue monograms only with reviewed university-owned logo assets.
7. Apply and smoke-test the D1 migration in a staging Worker, then run `npm run check` and
   manually test keyboard navigation, 320 px reflow, light/dark mode,
   reduced motion and lead delivery in a staging project.
8. Refresh directory evidence before its review expiry and use forward-only D1 migrations after the
   first production deployment; editing an already-applied migration does not change that database.

Programme entitlement, fees, dates, scholarships and outcomes can change. DekhoCampus is a discovery
and counselling platform; admission and payment remain with the relevant university.
