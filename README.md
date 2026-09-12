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

The browser-safe Supabase URL and publishable key need `VITE_` prefixes. The service-role key is
server-only and must never use a `VITE_` prefix.

## Quality commands

```sh
npm run typecheck
npm run lint
npm run build
npm run check
```

The CI workflow runs the combined check on every main-branch push and pull request.

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

## Database migrations

Apply migrations in timestamp order:

- `20260912090000_lead_intake_hardening.sql` replaces anonymous table inserts with a validated,
  consent-aware RPC and duplicate protection.
- `20260912100000_admin_invite_only.sql` removes first-registrant admin promotion.
- `20260912110000_catalog_verification_model.sql` adds offering evidence, specialisation mappings
  and a claim-evidence ledger.

Provision administrators only through trusted service-role tooling after identity verification.
Public sign-in never grants an administrative role.

## Release gates

Before production launch:

1. Inventory existing privileged accounts before the invite-only migration:
   `SELECT user_id, role FROM public.user_roles WHERE role = 'admin';`. Revoke legacy bootstrap
   grants, apply the migrations, then re-provision only identity-verified administrators with
   trusted service-role tooling. The migration deliberately stops if an old admin grant remains.
2. Disable unrestricted new-user creation in the hosted Supabase Auth settings, or replace the
   admin OAuth entry point with an identity-allowlisted server flow. Public authentication must not
   be usable to create unlimited non-admin accounts.
3. Complete an intake-by-intake editorial backfill. Legacy universities and offerings are
   unpublished and hidden by
   row-level security until their exact current evidence is added.
4. Verify the exact university, programme, delivery mode and session on the official UGC-DEB source;
   verify fees separately on the university's official source.
5. Put counselling intake behind a same-origin server or Edge Function that verifies CAPTCHA,
   rate-limits before validation and calls Supabase with a server-only credential; then revoke direct
   anonymous execution of the intake RPC. Configure OTP/DLT consent where applicable, CRM assignment,
   communication suppression and withdrawal handling before outbound campaigns.
6. Replace catalogue monograms only with reviewed university-owned logo assets.
7. Apply and smoke-test the migrations in a staging Supabase project, then run `npm run check` and
   manually test keyboard navigation, 320 px reflow, light/dark mode,
   reduced motion and lead delivery in a staging project.

Programme entitlement, fees, dates, scholarships and outcomes can change. DekhoCampus is a discovery
and counselling platform; admission and payment remain with the relevant university.
