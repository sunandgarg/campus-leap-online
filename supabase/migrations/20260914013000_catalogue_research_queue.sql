-- Private research-import queue.
--
-- The September 2026 course handoff explicitly marks every row as draft and
-- every programme-session approval as not certified. Keep that material out
-- of the anonymous catalogue while preserving the complete source package for
-- admin review. Moving a reviewed item into the public catalogue remains a
-- separate, evidence-gated editorial action.

-- Accreditation and ranking evidence is institutional context. Never let a
-- published row imply that either claim applies to one programme or offering.
UPDATE public.claim_evidence
SET published = FALSE
WHERE published = TRUE
  AND lower(btrim(claim_type)) IN ('accreditation', 'ranking')
  AND (program_slug IS NOT NULL OR offering_id IS NOT NULL);

ALTER TABLE public.claim_evidence
  ADD CONSTRAINT claim_evidence_institutional_claim_publish_scope CHECK (
    NOT published
    OR lower(btrim(claim_type)) NOT IN ('accreditation', 'ranking')
    OR (program_slug IS NULL AND offering_id IS NULL)
  );

CREATE SCHEMA IF NOT EXISTS catalogue_private;
REVOKE ALL ON SCHEMA catalogue_private FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.catalogue_import_batches (
  import_id UUID PRIMARY KEY,
  dataset_id TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  merged_on DATE,
  source_file_sha256 TEXT NOT NULL CHECK (source_file_sha256 ~ '^[a-f0-9]{64}$'),
  import_status TEXT NOT NULL DEFAULT 'staging'
    CHECK (import_status IN ('staging', 'ready', 'failed')),
  scope TEXT NOT NULL,
  source_precedence TEXT NOT NULL,
  money_encoding TEXT NOT NULL,
  publication_default TEXT NOT NULL,
  statistics JSONB NOT NULL DEFAULT '{}'::jsonb,
  field_dictionary JSONB NOT NULL DEFAULT '[]'::jsonb,
  acceptance_invariants JSONB NOT NULL DEFAULT '{}'::jsonb,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ready_at TIMESTAMPTZ,
  failure_reason TEXT,
  CHECK (jsonb_typeof(statistics) = 'object'),
  CHECK (jsonb_typeof(field_dictionary) = 'array'),
  CHECK (jsonb_typeof(acceptance_invariants) = 'object'),
  CHECK (
    (import_status = 'staging' AND ready_at IS NULL AND failure_reason IS NULL)
    OR (import_status = 'ready' AND ready_at IS NOT NULL AND failure_reason IS NULL)
    OR (
      import_status = 'failed'
      AND ready_at IS NULL
      AND nullif(btrim(failure_reason), '') IS NOT NULL
    )
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS catalogue_import_batches_ready_dataset_idx
  ON public.catalogue_import_batches (dataset_id)
  WHERE import_status = 'ready';

CREATE TABLE IF NOT EXISTS public.catalogue_research_universities (
  import_id UUID NOT NULL REFERENCES public.catalogue_import_batches(import_id) ON DELETE CASCADE,
  university_id TEXT NOT NULL,
  canonical_slug TEXT NOT NULL,
  university_display_name TEXT NOT NULL,
  legal_university_name TEXT,
  state_ut TEXT,
  registry_status TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  current_intake_approval_certified BOOLEAN NOT NULL DEFAULT FALSE,
  source_url TEXT,
  source_reference_period TEXT,
  identity_rechecked_on DATE,
  raw_record JSONB NOT NULL,
  PRIMARY KEY (import_id, university_id),
  UNIQUE (import_id, canonical_slug),
  CHECK (publication_status = 'draft'),
  CHECK (is_published = FALSE),
  CHECK (current_intake_approval_certified = FALSE)
);

CREATE TABLE IF NOT EXISTS public.catalogue_research_records (
  import_id UUID NOT NULL,
  course_row_id TEXT NOT NULL,
  university_id TEXT NOT NULL,
  canonical_university_slug TEXT NOT NULL,
  university_display_name TEXT NOT NULL,
  legal_university_name TEXT,
  state_ut TEXT,
  course TEXT NOT NULL,
  specialisation TEXT,
  collaboration_partner TEXT,
  import_bucket TEXT NOT NULL
    CHECK (import_bucket IN (
      'HELD_RESEARCH',
      'CANDIDATE_REVIEW',
      'SEPARATE_CERTIFICATE',
      'SEPARATE_BUNDLE_PATHWAY'
    )),
  record_kind TEXT,
  course_level TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  catalogue_candidate BOOLEAN NOT NULL DEFAULT FALSE,
  online_mode_evidence_status TEXT,
  current_intake_approval_status TEXT,
  regulatory_session_clearance TEXT,
  audit_disposition TEXT,
  audit_reason TEXT,
  publication_ready TEXT,
  evidence_status TEXT,
  evidence_type TEXT,
  reference_session TEXT,
  checked_on DATE,
  catalogue_evidence_url TEXT,
  programme_source_url_current TEXT,
  fee_source_url TEXT,
  fee_checked_on DATE,
  per_semester_fee_inr NUMERIC(14,2),
  per_year_fee_inr NUMERIC(14,2),
  full_course_fee_inr NUMERIC(14,2),
  fee_evidence_status TEXT,
  fee_display_note TEXT,
  quality_flags TEXT[] NOT NULL DEFAULT '{}',
  source_ids TEXT[] NOT NULL DEFAULT '{}',
  selected_fee_quote_id TEXT,
  parent_programme_id TEXT,
  parent_programme_title TEXT,
  track_name TEXT,
  raw_source_row_sha256 TEXT NOT NULL,
  raw_record JSONB NOT NULL,
  search_document TSVECTOR GENERATED ALWAYS AS (
    to_tsvector(
      'simple'::regconfig,
      coalesce(university_display_name, '') || ' ' ||
      coalesce(legal_university_name, '') || ' ' ||
      coalesce(state_ut, '') || ' ' ||
      coalesce(course, '') || ' ' ||
      coalesce(specialisation, '') || ' ' ||
      coalesce(collaboration_partner, '') || ' ' ||
      coalesce(parent_programme_title, '') || ' ' ||
      coalesce(track_name, '')
    )
  ) STORED,
  PRIMARY KEY (import_id, course_row_id),
  FOREIGN KEY (import_id, university_id)
    REFERENCES public.catalogue_research_universities(import_id, university_id)
    ON DELETE CASCADE,
  CHECK (publication_status = 'draft'),
  CHECK (is_published = FALSE),
  CHECK (catalogue_candidate = (import_bucket = 'CANDIDATE_REVIEW')),
  CHECK (
    current_intake_approval_status IS NULL
    OR current_intake_approval_status = 'NOT_AUDITED_AT_PROGRAMME_SESSION_LEVEL'
  ),
  CHECK (
    regulatory_session_clearance IS NULL
    OR regulatory_session_clearance = 'NOT_CERTIFIED_BY_THIS_EXPORT'
  ),
  CHECK (catalogue_evidence_url IS NULL OR catalogue_evidence_url ~* '^https?://'),
  CHECK (
    programme_source_url_current IS NULL
    OR programme_source_url_current ~* '^https?://'
  ),
  CHECK (fee_source_url IS NULL OR fee_source_url ~* '^https?://'),
  CHECK (per_semester_fee_inr IS NULL OR per_semester_fee_inr > 0),
  CHECK (per_year_fee_inr IS NULL OR per_year_fee_inr > 0),
  CHECK (full_course_fee_inr IS NULL OR full_course_fee_inr > 0),
  CHECK (raw_source_row_sha256 ~ '^[a-f0-9]{64}$'),
  UNIQUE (import_id, raw_source_row_sha256)
);

CREATE TABLE IF NOT EXISTS public.catalogue_research_sources (
  import_id UUID NOT NULL REFERENCES public.catalogue_import_batches(import_id) ON DELETE CASCADE,
  source_id TEXT NOT NULL,
  url TEXT NOT NULL CHECK (url ~* '^https?://'),
  roles TEXT[] NOT NULL DEFAULT '{}',
  course_row_ids TEXT[] NOT NULL DEFAULT '{}',
  recorded_checked_on_dates TEXT[] NOT NULL DEFAULT '{}',
  freshly_fetched_in_this_merge BOOLEAN NOT NULL DEFAULT FALSE,
  source_status TEXT NOT NULL
    CHECK (source_status = 'RETAINED_SOURCE_REFERENCE_NOT_REVERIFIED_BY_MERGE'),
  raw_record JSONB NOT NULL,
  PRIMARY KEY (import_id, source_id),
  CHECK (freshly_fetched_in_this_merge = FALSE)
);

CREATE TABLE IF NOT EXISTS public.catalogue_research_fee_quotes (
  import_id UUID NOT NULL REFERENCES public.catalogue_import_batches(import_id) ON DELETE CASCADE,
  archived_quote_id TEXT NOT NULL,
  source_quote_id TEXT,
  source_snapshot TEXT,
  source_id TEXT NOT NULL,
  usage TEXT NOT NULL
    CHECK (usage = 'PROVENANCE_ONLY_DO_NOT_AUTOFILL_OR_OVERRIDE_MASTER_FEES'),
  raw_record JSONB NOT NULL,
  PRIMARY KEY (import_id, archived_quote_id),
  FOREIGN KEY (import_id, source_id)
    REFERENCES public.catalogue_research_sources(import_id, source_id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS public.catalogue_research_record_sources (
  import_id UUID NOT NULL,
  course_row_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  PRIMARY KEY (import_id, course_row_id, source_id),
  FOREIGN KEY (import_id, course_row_id)
    REFERENCES public.catalogue_research_records(import_id, course_row_id)
    ON DELETE CASCADE,
  FOREIGN KEY (import_id, source_id)
    REFERENCES public.catalogue_research_sources(import_id, source_id)
    ON DELETE CASCADE
);

-- A run is append-only while staging and immutable after it becomes ready or
-- failed. The child guard also takes a key-share lock on the batch row, so the
-- finalizer's FOR UPDATE lock cannot race a last chunk into a ready dataset.
CREATE OR REPLACE FUNCTION catalogue_private.enforce_catalogue_import_batch_lifecycle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.import_status <> 'staging'
       OR NEW.ready_at IS NOT NULL
       OR NEW.failure_reason IS NOT NULL THEN
      RAISE EXCEPTION 'Catalogue imports must be created in staging state';
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Catalogue import runs are immutable';
  END IF;

  IF OLD.import_status <> 'staging' THEN
    RAISE EXCEPTION 'Finalized catalogue import runs are immutable';
  END IF;

  IF ROW(
    NEW.import_id,
    NEW.dataset_id,
    NEW.schema_version,
    NEW.merged_on,
    NEW.source_file_sha256,
    NEW.scope,
    NEW.source_precedence,
    NEW.money_encoding,
    NEW.publication_default,
    NEW.statistics,
    NEW.field_dictionary,
    NEW.acceptance_invariants,
    NEW.imported_at
  ) IS DISTINCT FROM ROW(
    OLD.import_id,
    OLD.dataset_id,
    OLD.schema_version,
    OLD.merged_on,
    OLD.source_file_sha256,
    OLD.scope,
    OLD.source_precedence,
    OLD.money_encoding,
    OLD.publication_default,
    OLD.statistics,
    OLD.field_dictionary,
    OLD.acceptance_invariants,
    OLD.imported_at
  ) THEN
    RAISE EXCEPTION 'Catalogue import identity and source metadata are immutable';
  END IF;

  IF NEW.import_status = 'staging' THEN
    IF NEW.ready_at IS NOT NULL OR NEW.failure_reason IS NOT NULL THEN
      RAISE EXCEPTION 'Staging catalogue imports cannot have completion metadata';
    END IF;
  ELSIF NEW.import_status = 'ready' THEN
    IF NEW.ready_at IS NULL OR NEW.failure_reason IS NOT NULL THEN
      RAISE EXCEPTION 'Ready catalogue imports require ready_at and no failure reason';
    END IF;
  ELSIF NEW.import_status = 'failed' THEN
    IF NEW.ready_at IS NOT NULL
       OR nullif(btrim(NEW.failure_reason), '') IS NULL THEN
      RAISE EXCEPTION 'Failed catalogue imports require a failure reason and no ready_at';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION catalogue_private.enforce_catalogue_import_batch_lifecycle()
  FROM PUBLIC, anon, authenticated, service_role;

CREATE TRIGGER catalogue_import_batches_lifecycle_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.catalogue_import_batches
  FOR EACH ROW EXECUTE FUNCTION catalogue_private.enforce_catalogue_import_batch_lifecycle();

CREATE OR REPLACE FUNCTION catalogue_private.enforce_catalogue_import_child_lifecycle()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_import_id UUID;
  v_import_status TEXT;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.import_id IS DISTINCT FROM OLD.import_id THEN
    RAISE EXCEPTION 'Catalogue research rows cannot move between import runs';
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_import_id := OLD.import_id;
  ELSE
    v_import_id := NEW.import_id;
  END IF;

  SELECT import_status INTO v_import_status
  FROM public.catalogue_import_batches
  WHERE import_id = v_import_id
  FOR KEY SHARE;

  IF v_import_status IS DISTINCT FROM 'staging' THEN
    RAISE EXCEPTION 'Catalogue research rows are writable only while their import is staging';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION catalogue_private.enforce_catalogue_import_child_lifecycle()
  FROM PUBLIC, anon, authenticated, service_role;

CREATE TRIGGER catalogue_research_universities_lifecycle_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.catalogue_research_universities
  FOR EACH ROW EXECUTE FUNCTION catalogue_private.enforce_catalogue_import_child_lifecycle();
CREATE TRIGGER catalogue_research_records_lifecycle_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.catalogue_research_records
  FOR EACH ROW EXECUTE FUNCTION catalogue_private.enforce_catalogue_import_child_lifecycle();
CREATE TRIGGER catalogue_research_sources_lifecycle_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.catalogue_research_sources
  FOR EACH ROW EXECUTE FUNCTION catalogue_private.enforce_catalogue_import_child_lifecycle();
CREATE TRIGGER catalogue_research_fee_quotes_lifecycle_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.catalogue_research_fee_quotes
  FOR EACH ROW EXECUTE FUNCTION catalogue_private.enforce_catalogue_import_child_lifecycle();
CREATE TRIGGER catalogue_research_record_sources_lifecycle_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.catalogue_research_record_sources
  FOR EACH ROW EXECUTE FUNCTION catalogue_private.enforce_catalogue_import_child_lifecycle();

CREATE INDEX IF NOT EXISTS catalogue_research_records_search_idx
  ON public.catalogue_research_records USING GIN (search_document);
CREATE INDEX IF NOT EXISTS catalogue_research_records_filter_idx
  ON public.catalogue_research_records (import_id, import_bucket, catalogue_candidate, course);
CREATE INDEX IF NOT EXISTS catalogue_research_records_university_idx
  ON public.catalogue_research_records (import_id, university_id);

ALTER TABLE public.catalogue_import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_research_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_research_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_research_fee_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_research_record_sources ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.catalogue_import_batches FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.catalogue_research_universities FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.catalogue_research_records FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.catalogue_research_sources FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.catalogue_research_fee_quotes FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.catalogue_research_record_sources FROM PUBLIC, anon, authenticated;

GRANT SELECT ON public.catalogue_import_batches TO authenticated;
GRANT SELECT ON public.catalogue_research_universities TO authenticated;
GRANT SELECT ON public.catalogue_research_records TO authenticated;
GRANT SELECT ON public.catalogue_research_sources TO authenticated;
GRANT SELECT ON public.catalogue_research_fee_quotes TO authenticated;
GRANT SELECT ON public.catalogue_research_record_sources TO authenticated;

GRANT SELECT, INSERT ON public.catalogue_import_batches TO service_role;
GRANT SELECT, INSERT ON public.catalogue_research_universities TO service_role;
GRANT SELECT, INSERT ON public.catalogue_research_records TO service_role;
GRANT SELECT, INSERT ON public.catalogue_research_sources TO service_role;
GRANT SELECT, INSERT ON public.catalogue_research_fee_quotes TO service_role;
GRANT SELECT, INSERT ON public.catalogue_research_record_sources TO service_role;

CREATE POLICY "admins read catalogue import batches"
  ON public.catalogue_import_batches FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins read catalogue research universities"
  ON public.catalogue_research_universities FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (
      SELECT 1
      FROM public.catalogue_import_batches AS batch
      WHERE batch.import_id = catalogue_research_universities.import_id
        AND batch.import_status = 'ready'
    )
  );
CREATE POLICY "admins read catalogue research records"
  ON public.catalogue_research_records FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (
      SELECT 1
      FROM public.catalogue_import_batches AS batch
      WHERE batch.import_id = catalogue_research_records.import_id
        AND batch.import_status = 'ready'
    )
  );
CREATE POLICY "admins read catalogue research sources"
  ON public.catalogue_research_sources FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (
      SELECT 1
      FROM public.catalogue_import_batches AS batch
      WHERE batch.import_id = catalogue_research_sources.import_id
        AND batch.import_status = 'ready'
    )
  );
CREATE POLICY "admins read catalogue research fee quotes"
  ON public.catalogue_research_fee_quotes FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (
      SELECT 1
      FROM public.catalogue_import_batches AS batch
      WHERE batch.import_id = catalogue_research_fee_quotes.import_id
        AND batch.import_status = 'ready'
    )
  );
CREATE POLICY "admins read catalogue research record sources"
  ON public.catalogue_research_record_sources FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND EXISTS (
      SELECT 1
      FROM public.catalogue_import_batches AS batch
      WHERE batch.import_id = catalogue_research_record_sources.import_id
        AND batch.import_status = 'ready'
    )
  );

CREATE OR REPLACE FUNCTION public.fail_catalogue_research_import(
  p_import_id UUID,
  p_failure_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_failure_reason TEXT := left(
    coalesce(nullif(btrim(p_failure_reason), ''), 'Unknown catalogue import failure'),
    1000
  );
  v_dataset_id TEXT;
BEGIN
  SELECT dataset_id INTO v_dataset_id
  FROM public.catalogue_import_batches
  WHERE import_id = p_import_id
    AND import_status = 'staging'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Catalogue import is not in staging state';
  END IF;

  UPDATE public.catalogue_import_batches
  SET
    import_status = 'failed',
    ready_at = NULL,
    failure_reason = v_failure_reason
  WHERE import_id = p_import_id;

  RETURN jsonb_build_object(
    'import_id', p_import_id,
    'dataset_id', v_dataset_id,
    'status', 'failed'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.fail_catalogue_research_import(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fail_catalogue_research_import(UUID, TEXT)
  TO service_role;

CREATE OR REPLACE FUNCTION public.finalize_catalogue_research_import(
  p_import_id UUID,
  p_source_file_sha256 TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_batch public.catalogue_import_batches%ROWTYPE;
  v_university_count INTEGER;
  v_university_ids_with_records INTEGER;
  v_record_count INTEGER;
  v_candidate_count INTEGER;
  v_held_count INTEGER;
  v_certificate_count INTEGER;
  v_bundle_count INTEGER;
  v_source_count INTEGER;
  v_expected_source_link_count INTEGER;
  v_reverse_expected_source_link_count INTEGER;
  v_source_link_count INTEGER;
  v_quote_count INTEGER;
BEGIN
  SELECT * INTO v_batch
  FROM public.catalogue_import_batches
  WHERE import_id = p_import_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Unknown catalogue dataset';
  END IF;
  IF v_batch.import_status <> 'staging' THEN
    RAISE EXCEPTION 'Catalogue import is not in staging state';
  END IF;
  IF p_source_file_sha256 !~ '^[a-f0-9]{64}$'
     OR p_source_file_sha256 <> v_batch.source_file_sha256 THEN
    RAISE EXCEPTION 'Catalogue source checksum mismatch';
  END IF;

  SELECT count(*) INTO v_university_count
  FROM public.catalogue_research_universities
  WHERE import_id = p_import_id;
  SELECT count(*) INTO v_record_count
  FROM public.catalogue_research_records
  WHERE import_id = p_import_id;
  SELECT count(DISTINCT university_id) INTO v_university_ids_with_records
  FROM public.catalogue_research_records
  WHERE import_id = p_import_id;
  SELECT count(*) INTO v_candidate_count
  FROM public.catalogue_research_records
  WHERE import_id = p_import_id AND catalogue_candidate = TRUE;
  SELECT count(*) INTO v_held_count
  FROM public.catalogue_research_records
  WHERE import_id = p_import_id AND import_bucket = 'HELD_RESEARCH';
  SELECT count(*) INTO v_certificate_count
  FROM public.catalogue_research_records
  WHERE import_id = p_import_id AND import_bucket = 'SEPARATE_CERTIFICATE';
  SELECT count(*) INTO v_bundle_count
  FROM public.catalogue_research_records
  WHERE import_id = p_import_id AND import_bucket = 'SEPARATE_BUNDLE_PATHWAY';
  SELECT count(*) INTO v_source_count
  FROM public.catalogue_research_sources
  WHERE import_id = p_import_id;
  SELECT coalesce(sum(cardinality(source_ids)), 0) INTO v_expected_source_link_count
  FROM public.catalogue_research_records
  WHERE import_id = p_import_id;
  SELECT coalesce(sum(cardinality(course_row_ids)), 0)
    INTO v_reverse_expected_source_link_count
  FROM public.catalogue_research_sources
  WHERE import_id = p_import_id;
  SELECT count(*) INTO v_source_link_count
  FROM public.catalogue_research_record_sources
  WHERE import_id = p_import_id;
  SELECT count(*) INTO v_quote_count
  FROM public.catalogue_research_fee_quotes
  WHERE import_id = p_import_id;

  IF v_university_count IS DISTINCT FROM
       (v_batch.acceptance_invariants->>'university_registry_count')::INTEGER
     OR v_record_count IS DISTINCT FROM
       (v_batch.acceptance_invariants->>'record_count')::INTEGER
     OR v_university_ids_with_records IS DISTINCT FROM
       (v_batch.acceptance_invariants->>'university_ids_with_records')::INTEGER
     OR v_candidate_count IS DISTINCT FROM
       (v_batch.acceptance_invariants->>'catalogue_candidate_count')::INTEGER
     OR v_held_count IS DISTINCT FROM
       (v_batch.acceptance_invariants->>'held_count')::INTEGER
     OR v_certificate_count IS DISTINCT FROM
       (v_batch.acceptance_invariants->>'certificate_count')::INTEGER
     OR v_bundle_count IS DISTINCT FROM
       (v_batch.acceptance_invariants->>'bundle_count')::INTEGER
     OR v_source_count IS DISTINCT FROM
       (v_batch.statistics->>'retained_source_references')::INTEGER
     OR v_source_link_count IS DISTINCT FROM v_expected_source_link_count
     OR v_source_link_count IS DISTINCT FROM v_reverse_expected_source_link_count
     OR v_quote_count IS DISTINCT FROM
       (v_batch.statistics->>'historical_fee_quotes')::INTEGER
     OR (v_batch.acceptance_invariants->>'all_records_draft')::BOOLEAN
       IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Catalogue import counts do not match acceptance invariants';
  END IF;

  IF nullif(v_batch.acceptance_invariants->>'authoritative_snapshot_id', '') IS NULL
     OR EXISTS (
       SELECT 1
       FROM public.catalogue_research_records AS record
       WHERE record.import_id = p_import_id
         AND record.raw_record->>'source_snapshot_id' IS DISTINCT FROM
           v_batch.acceptance_invariants->>'authoritative_snapshot_id'
     ) THEN
    RAISE EXCEPTION 'Catalogue source snapshot does not match its acceptance invariant';
  END IF;

  IF nullif(v_batch.acceptance_invariants->>'amity_online_id', '') IS NULL
     OR nullif(v_batch.acceptance_invariants->>'amity_rajasthan_id', '') IS NULL
     OR v_batch.acceptance_invariants->>'amity_online_id' =
       v_batch.acceptance_invariants->>'amity_rajasthan_id'
     OR NOT EXISTS (
       SELECT 1
       FROM public.catalogue_research_universities AS university
       WHERE university.import_id = p_import_id
         AND university.university_id = v_batch.acceptance_invariants->>'amity_online_id'
     )
     OR NOT EXISTS (
       SELECT 1
       FROM public.catalogue_research_universities AS university
       WHERE university.import_id = p_import_id
         AND university.university_id = v_batch.acceptance_invariants->>'amity_rajasthan_id'
     ) THEN
    RAISE EXCEPTION 'Catalogue identity invariants are incomplete';
  END IF;

  IF EXISTS (
       SELECT 1
       FROM public.catalogue_research_universities AS research_university
       LEFT JOIN public.universities AS canonical_university
         ON canonical_university.slug = research_university.canonical_slug
       WHERE research_university.import_id = p_import_id
         AND canonical_university.slug IS NULL
     )
     OR EXISTS (
       SELECT 1
       FROM public.catalogue_research_records AS record
       JOIN public.catalogue_research_universities AS research_university
         ON research_university.import_id = record.import_id
        AND research_university.university_id = record.university_id
       WHERE record.import_id = p_import_id
         AND record.canonical_university_slug IS DISTINCT FROM
           research_university.canonical_slug
     ) THEN
    RAISE EXCEPTION 'Catalogue canonical-university crosswalk is inconsistent';
  END IF;

  IF jsonb_typeof(v_batch.acceptance_invariants->'manipal_catalogue_counts')
       IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Manipal catalogue-count invariant is missing';
  END IF;

  IF NOT (
       v_batch.acceptance_invariants->'manipal_catalogue_counts'
       ?& ARRAY['MAHE', 'MUJ', 'SMU']
     )
     OR (
       SELECT count(*)
       FROM jsonb_object_keys(
         v_batch.acceptance_invariants->'manipal_catalogue_counts'
       )
     ) <> 3 THEN
    RAISE EXCEPTION 'Manipal catalogue-count invariant has unexpected keys';
  END IF;

  IF EXISTS (
       SELECT 1
       FROM jsonb_each_text(
         v_batch.acceptance_invariants->'manipal_catalogue_counts'
       ) AS expected(university_code, expected_count)
       WHERE (
         SELECT count(*)
         FROM public.catalogue_research_records AS record
         WHERE record.import_id = p_import_id
           AND record.import_bucket = 'CANDIDATE_REVIEW'
           AND record.raw_record->>'university_code' = expected.university_code
       ) IS DISTINCT FROM expected.expected_count::INTEGER
     ) THEN
    RAISE EXCEPTION 'Manipal catalogue counts do not match acceptance invariants';
  END IF;

  IF EXISTS (
       SELECT 1
       FROM public.catalogue_research_records AS record
       CROSS JOIN LATERAL unnest(record.source_ids) AS expected(source_id)
       WHERE record.import_id = p_import_id
         AND NOT EXISTS (
           SELECT 1
           FROM public.catalogue_research_record_sources AS link
           WHERE link.import_id = record.import_id
             AND link.course_row_id = record.course_row_id
             AND link.source_id = expected.source_id
         )
     )
     OR EXISTS (
       SELECT 1
       FROM public.catalogue_research_record_sources AS link
       JOIN public.catalogue_research_records AS record
         ON record.import_id = link.import_id
        AND record.course_row_id = link.course_row_id
       WHERE link.import_id = p_import_id
         AND NOT (link.source_id = ANY(record.source_ids))
     )
     OR EXISTS (
       SELECT 1
       FROM public.catalogue_research_sources AS source
       CROSS JOIN LATERAL unnest(source.course_row_ids) AS expected(course_row_id)
       WHERE source.import_id = p_import_id
         AND NOT EXISTS (
           SELECT 1
           FROM public.catalogue_research_record_sources AS link
           WHERE link.import_id = source.import_id
             AND link.source_id = source.source_id
             AND link.course_row_id = expected.course_row_id
         )
     )
     OR EXISTS (
       SELECT 1
       FROM public.catalogue_research_record_sources AS link
       JOIN public.catalogue_research_sources AS source
         ON source.import_id = link.import_id
        AND source.source_id = link.source_id
       WHERE link.import_id = p_import_id
         AND NOT (link.course_row_id = ANY(source.course_row_ids))
     ) THEN
    RAISE EXCEPTION 'Catalogue record/source links are not exact and bidirectional';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.catalogue_research_records
    WHERE import_id = p_import_id
      AND (
        publication_status <> 'draft'
        OR is_published <> FALSE
        OR current_intake_approval_status IS DISTINCT FROM
          'NOT_AUDITED_AT_PROGRAMME_SESSION_LEVEL'
        OR regulatory_session_clearance IS DISTINCT FROM
          'NOT_CERTIFIED_BY_THIS_EXPORT'
      )
  ) THEN
    RAISE EXCEPTION 'Catalogue handoff contains a row that is not fail-closed';
  END IF;

  UPDATE public.catalogue_import_batches
  SET
    import_status = 'ready',
    ready_at = now(),
    failure_reason = NULL
  WHERE import_id = p_import_id;

  RETURN jsonb_build_object(
    'import_id', p_import_id,
    'dataset_id', v_batch.dataset_id,
    'universities', v_university_count,
    'records', v_record_count,
    'candidates', v_candidate_count,
    'sources', v_source_count,
    'source_links', v_source_link_count,
    'historical_fee_quotes', v_quote_count,
    'status', 'ready'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_catalogue_research_import(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_catalogue_research_import(UUID, TEXT)
  TO service_role;

COMMENT ON TABLE public.catalogue_research_records IS
  'Private source-preserving editorial queue. Rows are never public offerings and must not bypass catalogue evidence gates.';
COMMENT ON FUNCTION public.finalize_catalogue_research_import(UUID, TEXT) IS
  'Atomically exposes a fully staged research batch to admins only after validating the source invariants and fail-closed publication state.';
