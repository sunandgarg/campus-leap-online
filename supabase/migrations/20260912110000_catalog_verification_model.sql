-- Canonical 2026 catalogue model.
-- A university, a degree template and an intake-specific offering are separate
-- records. Facts that can change are attached to the offering and carry their
-- own evidence and review dates.

ALTER TABLE public.universities
  ADD COLUMN IF NOT EXISTS legal_name TEXT,
  ADD COLUMN IF NOT EXISTS hei_id TEXT,
  ADD COLUMN IF NOT EXISTS profile_depth TEXT NOT NULL DEFAULT 'directory'
    CHECK (profile_depth IN ('directory', 'complete')),
  ADD COLUMN IF NOT EXISTS verification_source_url TEXT,
  ADD COLUMN IF NOT EXISTS verification_academic_session TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ;

ALTER TABLE public.universities
  ADD CONSTRAINT universities_slug_format CHECK (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ) NOT VALID,
  ADD CONSTRAINT universities_public_urls_are_http CHECK (
    (verification_source_url IS NULL OR verification_source_url ~* '^https?://')
    AND (logo_url IS NULL OR logo_url = '' OR logo_url ~* '^https?://')
    AND (hero_image_url IS NULL OR hero_image_url = '' OR hero_image_url ~* '^https?://')
  ) NOT VALID,
  ADD CONSTRAINT universities_domain_is_hostname CHECK (
    domain IS NULL OR domain = '' OR lower(domain) ~ '^[a-z0-9.-]+\.[a-z]{2,}$'
  ) NOT VALID;
ALTER TABLE public.programs
  ADD CONSTRAINT programs_slug_format CHECK (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ) NOT VALID,
  ADD CONSTRAINT programs_hero_url_is_http CHECK (
    hero_image_url IS NULL OR hero_image_url = '' OR hero_image_url ~* '^https?://'
  ) NOT VALID;

-- Publishing is always an explicit editorial action. This corrects permissive
-- defaults from the original schema for every future CMS/import record.
ALTER TABLE public.universities
  ALTER COLUMN published SET DEFAULT FALSE;
ALTER TABLE public.programs
  ALTER COLUMN published SET DEFAULT FALSE;

-- Fail closed on every pre-existing university. Legacy rows predate the
-- evidence fields above, so leaving them published would present unsupported
-- editorial copy as a documented directory record. Re-publish only after the
-- source, session and review fields have been completed in the CMS.
UPDATE public.universities
SET published = FALSE
WHERE published = TRUE;

-- Anonymous catalogue readers receive only fields that are safe to present as
-- editorial or source-backed facts. Legacy ratings, outcomes and approval
-- arrays remain available to administrators for cleanup but are not exposed by
-- the public REST contract.
REVOKE SELECT ON public.universities FROM anon;
GRANT SELECT (
  slug,
  name,
  legal_name,
  hei_id,
  short_name,
  city,
  state,
  established,
  domain,
  logo_url,
  hero_image_url,
  accent_color,
  highlights,
  about,
  sort_order,
  published,
  profile_depth,
  verification_source_url,
  verification_academic_session,
  verified_at,
  next_review_at
) ON public.universities TO anon;

REVOKE SELECT ON public.programs FROM anon;
GRANT SELECT (
  slug,
  code,
  name,
  level,
  duration_years,
  semesters,
  eligibility,
  overview,
  hero_image_url,
  specialisations,
  curriculum,
  careers,
  sort_order,
  published
) ON public.programs TO anon;

DROP POLICY IF EXISTS "public read published universities" ON public.universities;
CREATE POLICY "public read published universities"
  ON public.universities FOR SELECT TO anon
  USING (
    published = TRUE
    AND nullif(trim(coalesce(verification_source_url, '')), '') IS NOT NULL
    AND verification_source_url ~* '^https?://'
    AND nullif(trim(coalesce(verification_academic_session, '')), '') IS NOT NULL
    AND verified_at IS NOT NULL
    AND verified_at <= now()
  );
DROP POLICY IF EXISTS "public read published programs" ON public.programs;
CREATE POLICY "public read published programs"
  ON public.programs FOR SELECT TO anon
  USING (published = TRUE);

ALTER TABLE public.university_programs
  ALTER COLUMN total_fee DROP NOT NULL,
  ALTER COLUMN total_fee DROP DEFAULT,
  ALTER COLUMN per_semester_fee DROP NOT NULL,
  ALTER COLUMN per_semester_fee DROP DEFAULT,
  ALTER COLUMN emi_per_month DROP NOT NULL,
  ALTER COLUMN emi_per_month DROP DEFAULT,
  ALTER COLUMN seats_filled_percent DROP NOT NULL,
  ALTER COLUMN seats_filled_percent DROP DEFAULT;

ALTER TABLE public.university_programs
  ALTER COLUMN published SET DEFAULT FALSE;

ALTER TABLE public.university_programs
  ADD COLUMN IF NOT EXISTS official_programme_name TEXT,
  ADD COLUMN IF NOT EXISTS delivery_mode TEXT NOT NULL DEFAULT 'ONLINE'
    CHECK (delivery_mode IN ('ONLINE', 'ODL')),
  ADD COLUMN IF NOT EXISTS academic_session TEXT,
  ADD COLUMN IF NOT EXISTS entitlement_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (entitlement_status IN ('verified', 'unverified', 'expired', 'no-admission', 'debarred')),
  ADD COLUMN IF NOT EXISTS entitlement_source_url TEXT,
  ADD COLUMN IF NOT EXISTS university_programme_url TEXT,
  ADD COLUMN IF NOT EXISTS official_application_url TEXT,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS evidence_snapshot_hash TEXT,
  ADD COLUMN IF NOT EXISTS fees_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS per_semester_fee_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS emi_per_month_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS fee_source_url TEXT,
  ADD COLUMN IF NOT EXISTS fee_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fee_next_review_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS fee_components JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS refund_policy_url TEXT,
  ADD COLUMN IF NOT EXISTS duration_years NUMERIC(3,1),
  ADD COLUMN IF NOT EXISTS semesters INTEGER,
  ADD COLUMN IF NOT EXISTS eligibility TEXT,
  ADD COLUMN IF NOT EXISTS exam_mode TEXT,
  ADD COLUMN IF NOT EXISTS curriculum JSONB,
  ADD COLUMN IF NOT EXISTS scholarship_summary TEXT;

REVOKE SELECT ON public.university_programs FROM anon;
GRANT SELECT (
  id,
  university_slug,
  program_slug,
  total_fee,
  per_semester_fee,
  emi_per_month,
  sort_order,
  published,
  updated_at,
  official_programme_name,
  delivery_mode,
  academic_session,
  entitlement_status,
  entitlement_source_url,
  university_programme_url,
  official_application_url,
  verified_at,
  next_review_at,
  fees_verified,
  per_semester_fee_verified,
  emi_per_month_verified,
  fee_source_url,
  fee_verified_at,
  fee_next_review_at,
  refund_policy_url,
  duration_years,
  semesters,
  eligibility,
  exam_mode,
  curriculum
) ON public.university_programs TO anon;

-- Existing legacy rows need an editorial migration before these constraints can
-- be validated. NOT VALID still enforces them for every new or changed row.
ALTER TABLE public.university_programs
  ADD CONSTRAINT offering_publish_requires_current_evidence CHECK (
    NOT published OR (
      entitlement_status = 'verified'
      AND nullif(trim(coalesce(official_programme_name, '')), '') IS NOT NULL
      AND nullif(trim(coalesce(academic_session, '')), '') IS NOT NULL
      AND nullif(trim(coalesce(entitlement_source_url, '')), '') IS NOT NULL
      AND verified_at IS NOT NULL
      AND next_review_at IS NOT NULL
      AND next_review_at > verified_at
    )
  ) NOT VALID,
  ADD CONSTRAINT offering_fee_claim_requires_evidence CHECK (
    NOT fees_verified OR (
      total_fee IS NOT NULL AND total_fee > 0
      AND nullif(trim(coalesce(fee_source_url, '')), '') IS NOT NULL
      AND fee_verified_at IS NOT NULL
      AND fee_next_review_at IS NOT NULL
      AND fee_next_review_at > fee_verified_at
    )
  ) NOT VALID,
  ADD CONSTRAINT offering_semester_fee_claim_requires_evidence CHECK (
    NOT per_semester_fee_verified OR (
      per_semester_fee IS NOT NULL AND per_semester_fee > 0
      AND nullif(trim(coalesce(fee_source_url, '')), '') IS NOT NULL
      AND fee_verified_at IS NOT NULL
      AND fee_next_review_at IS NOT NULL
      AND fee_next_review_at > fee_verified_at
    )
  ) NOT VALID,
  ADD CONSTRAINT offering_emi_claim_requires_evidence CHECK (
    NOT emi_per_month_verified OR (
      emi_per_month IS NOT NULL AND emi_per_month > 0
      AND nullif(trim(coalesce(fee_source_url, '')), '') IS NOT NULL
      AND fee_verified_at IS NOT NULL
      AND fee_next_review_at IS NOT NULL
      AND fee_next_review_at > fee_verified_at
    )
  ) NOT VALID,
  ADD CONSTRAINT offering_fee_amounts_must_be_positive CHECK (
    (total_fee IS NULL OR total_fee > 0)
    AND (per_semester_fee IS NULL OR per_semester_fee > 0)
    AND (emi_per_month IS NULL OR emi_per_month > 0)
  ) NOT VALID,
  ADD CONSTRAINT offering_fee_amounts_require_evidence_flag CHECK (
    (total_fee IS NULL OR fees_verified)
    AND (per_semester_fee IS NULL OR per_semester_fee_verified)
    AND (emi_per_month IS NULL OR emi_per_month_verified)
  ) NOT VALID,
  ADD CONSTRAINT offering_academic_shape_must_be_positive CHECK (
    (duration_years IS NULL OR duration_years > 0)
    AND (semesters IS NULL OR semesters > 0)
  ) NOT VALID,
  ADD CONSTRAINT offering_public_urls_are_http CHECK (
    (entitlement_source_url IS NULL OR entitlement_source_url ~* '^https?://')
    AND (university_programme_url IS NULL OR university_programme_url ~* '^https?://')
    AND (official_application_url IS NULL OR official_application_url ~* '^https?://')
    AND (fee_source_url IS NULL OR fee_source_url ~* '^https?://')
    AND (refund_policy_url IS NULL OR refund_policy_url ~* '^https?://')
  ) NOT VALID;

COMMENT ON COLUMN public.university_programs.entitlement_status IS
  'Status for the exact university-programme-mode-session tuple; unverified records must not be recommended as entitled.';
COMMENT ON COLUMN public.university_programs.fees_verified IS
  'True only when a current fee_source_url review substantiates total_fee for this intake.';
COMMENT ON COLUMN public.university_programs.per_semester_fee_verified IS
  'True only when fee_source_url and fee_verified_at substantiate per_semester_fee; otherwise any displayed value must be labelled as derived.';
COMMENT ON COLUMN public.university_programs.emi_per_month_verified IS
  'True only when fee_source_url and fee_verified_at substantiate emi_per_month; otherwise any displayed value must be labelled as an arithmetic estimate, not an offered EMI plan.';

CREATE INDEX IF NOT EXISTS university_programs_verification_idx
  ON public.university_programs (entitlement_status, academic_session, published);
CREATE INDEX IF NOT EXISTS university_programs_review_idx
  ON public.university_programs (next_review_at)
  WHERE published = TRUE;

-- The legacy table allowed only one offering per university/program. Preserve
-- historical intakes and both ONLINE/ODL evidence as separate tuples.
ALTER TABLE public.university_programs
  DROP CONSTRAINT IF EXISTS university_programs_university_slug_program_slug_key;
CREATE UNIQUE INDEX IF NOT EXISTS university_programs_intake_unique_idx
  ON public.university_programs (
    university_slug,
    program_slug,
    delivery_mode,
    coalesce(academic_session, '')
  );

-- Fail closed: legacy offerings have no intake-level evidence in the new model,
-- so unpublish them before replacing the permissive public read policy. Admins
-- retain access through the existing role-gated policies and may republish only
-- after completing the evidence fields enforced above.
UPDATE public.university_programs
SET
  published = FALSE,
  total_fee = CASE
    WHEN fees_verified
      AND total_fee > 0
      AND fee_verified_at IS NOT NULL
      AND fee_next_review_at > now()
      AND fee_source_url ~* '^https?://'
      THEN total_fee
    ELSE NULL
  END,
  per_semester_fee = CASE
    WHEN per_semester_fee_verified
      AND per_semester_fee > 0
      AND fee_verified_at IS NOT NULL
      AND fee_next_review_at > now()
      AND fee_source_url ~* '^https?://'
      THEN per_semester_fee
    ELSE NULL
  END,
  emi_per_month = CASE
    WHEN emi_per_month_verified
      AND emi_per_month > 0
      AND fee_verified_at IS NOT NULL
      AND fee_next_review_at > now()
      AND fee_source_url ~* '^https?://'
      THEN emi_per_month
    ELSE NULL
  END,
  fees_verified = fees_verified
    AND coalesce(total_fee > 0, FALSE)
    AND fee_verified_at IS NOT NULL
    AND coalesce(fee_next_review_at > now(), FALSE)
    AND coalesce(fee_source_url ~* '^https?://', FALSE),
  per_semester_fee_verified = per_semester_fee_verified
    AND coalesce(per_semester_fee > 0, FALSE)
    AND fee_verified_at IS NOT NULL
    AND coalesce(fee_next_review_at > now(), FALSE)
    AND coalesce(fee_source_url ~* '^https?://', FALSE),
  emi_per_month_verified = emi_per_month_verified
    AND coalesce(emi_per_month > 0, FALSE)
    AND fee_verified_at IS NOT NULL
    AND coalesce(fee_next_review_at > now(), FALSE)
    AND coalesce(fee_source_url ~* '^https?://', FALSE),
  entitlement_source_url = CASE
    WHEN entitlement_source_url ~* '^https?://' THEN entitlement_source_url
    ELSE NULL
  END,
  university_programme_url = CASE
    WHEN university_programme_url ~* '^https?://' THEN university_programme_url
    ELSE NULL
  END,
  official_application_url = CASE
    WHEN official_application_url ~* '^https?://' THEN official_application_url
    ELSE NULL
  END,
  fee_source_url = CASE WHEN fee_source_url ~* '^https?://' THEN fee_source_url ELSE NULL END,
  refund_policy_url = CASE
    WHEN refund_policy_url ~* '^https?://' THEN refund_policy_url
    ELSE NULL
  END,
  duration_years = CASE WHEN duration_years > 0 THEN duration_years ELSE NULL END,
  semesters = CASE WHEN semesters > 0 THEN semesters ELSE NULL END;

DROP POLICY IF EXISTS "public read published offerings" ON public.university_programs;
CREATE POLICY "public read current verified offerings"
  ON public.university_programs FOR SELECT TO anon
  USING (
    published = TRUE
    AND entitlement_status = 'verified'
    AND verified_at IS NOT NULL
    AND verified_at <= now()
    AND next_review_at > now()
    AND nullif(trim(coalesce(entitlement_source_url, '')), '') IS NOT NULL
    AND (
      (
        fees_verified = FALSE
        AND per_semester_fee_verified = FALSE
        AND emi_per_month_verified = FALSE
      )
      OR (
        fee_source_url ~* '^https?://'
        AND fee_verified_at IS NOT NULL
        AND fee_verified_at <= now()
        AND fee_next_review_at > now()
      )
    )
    AND EXISTS (
      SELECT 1
      FROM public.universities university
      WHERE university.slug = university_programs.university_slug
        AND university.published = TRUE
        AND university.profile_depth = 'complete'
        AND nullif(trim(coalesce(university.verification_source_url, '')), '') IS NOT NULL
        AND university.verified_at IS NOT NULL
        AND university.verified_at <= now()
        AND university.next_review_at > now()
    )
    AND EXISTS (
      SELECT 1
      FROM public.programs program
      WHERE program.slug = university_programs.program_slug
        AND program.published = TRUE
    )
  );

-- Only explicitly supported public configuration may be read through the
-- anonymous REST API. Future internal/admin settings stay role-gated.
DROP POLICY IF EXISTS "public read settings" ON public.site_settings;
CREATE POLICY "public read supported settings"
  ON public.site_settings FOR SELECT TO anon
  USING (key = 'announcement');
CREATE POLICY "admins read all settings"
  ON public.site_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.specialisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  program_slug TEXT REFERENCES public.programs(slug) ON DELETE SET NULL ON UPDATE CASCADE,
  category TEXT,
  summary TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  career_directions TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.offering_specialisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offering_id UUID NOT NULL REFERENCES public.university_programs(id) ON DELETE CASCADE,
  specialisation_id UUID NOT NULL REFERENCES public.specialisations(id) ON DELETE CASCADE,
  university_label TEXT,
  availability_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (availability_status IN ('verified', 'unverified', 'withdrawn')),
  academic_session TEXT,
  source_url TEXT,
  verified_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.offering_specialisations
  ADD CONSTRAINT offering_specialisation_publish_requires_evidence CHECK (
    NOT published OR (
      availability_status = 'verified'
      AND nullif(trim(coalesce(academic_session, '')), '') IS NOT NULL
      AND nullif(trim(coalesce(source_url, '')), '') IS NOT NULL
      AND verified_at IS NOT NULL
      AND next_review_at IS NOT NULL
      AND next_review_at > verified_at
    )
  ) NOT VALID,
  ADD CONSTRAINT offering_specialisation_source_is_http CHECK (
    source_url IS NULL OR source_url ~* '^https?://'
  ) NOT VALID;

CREATE TABLE IF NOT EXISTS public.claim_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rendered_claim TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  university_slug TEXT REFERENCES public.universities(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  program_slug TEXT REFERENCES public.programs(slug) ON DELETE CASCADE ON UPDATE CASCADE,
  offering_id UUID REFERENCES public.university_programs(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_date DATE,
  academic_session TEXT,
  methodology TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (expires_at > verified_at)
);

ALTER TABLE public.claim_evidence
  ADD CONSTRAINT claim_evidence_source_is_http CHECK (
    source_url ~* '^https?://'
  ) NOT VALID;

CREATE INDEX IF NOT EXISTS offering_specialisations_offering_idx
  ON public.offering_specialisations (offering_id, availability_status, published);
CREATE UNIQUE INDEX IF NOT EXISTS offering_specialisations_unique_idx
  ON public.offering_specialisations (
    offering_id,
    specialisation_id,
    coalesce(academic_session, '')
  );
CREATE INDEX IF NOT EXISTS claim_evidence_scope_idx
  ON public.claim_evidence (university_slug, program_slug, expires_at, published);

GRANT SELECT ON public.specialisations, public.offering_specialisations TO anon, authenticated;
GRANT SELECT ON public.claim_evidence TO authenticated;
GRANT SELECT (
  id,
  rendered_claim,
  claim_type,
  university_slug,
  program_slug,
  offering_id,
  source_url,
  source_date,
  academic_session,
  methodology,
  verified_at,
  expires_at,
  published,
  created_at,
  updated_at
) ON public.claim_evidence TO anon;
GRANT INSERT, UPDATE, DELETE ON public.specialisations, public.offering_specialisations, public.claim_evidence
  TO authenticated;
GRANT ALL ON public.specialisations, public.offering_specialisations, public.claim_evidence
  TO service_role;

ALTER TABLE public.specialisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offering_specialisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published specialisations"
  ON public.specialisations FOR SELECT TO anon, authenticated
  USING (published = TRUE);
CREATE POLICY "admins manage specialisations"
  ON public.specialisations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read verified offering specialisations"
  ON public.offering_specialisations FOR SELECT TO anon, authenticated
  USING (
    published = TRUE
    AND availability_status = 'verified'
    AND verified_at IS NOT NULL
    AND verified_at <= now()
    AND next_review_at > now()
    AND nullif(trim(coalesce(source_url, '')), '') IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.university_programs offering
      WHERE offering.id = offering_specialisations.offering_id
        AND offering.published = TRUE
        AND offering.entitlement_status = 'verified'
        AND offering.verified_at IS NOT NULL
        AND offering.verified_at <= now()
        AND offering.next_review_at > now()
        AND offering.academic_session = offering_specialisations.academic_session
    )
  );
CREATE POLICY "admins manage offering specialisations"
  ON public.offering_specialisations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public read current claim evidence"
  ON public.claim_evidence FOR SELECT TO anon
  USING (
    published = TRUE
    AND verified_at <= now()
    AND expires_at > now()
    AND source_url ~* '^https?://'
  );
CREATE POLICY "admins manage claim evidence"
  ON public.claim_evidence FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER specialisations_touch
  BEFORE UPDATE ON public.specialisations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER offering_specialisations_touch
  BEFORE UPDATE ON public.offering_specialisations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER claim_evidence_touch
  BEFORE UPDATE ON public.claim_evidence
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
