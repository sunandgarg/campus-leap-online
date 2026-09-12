ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS consent_version TEXT,
  ADD COLUMN IF NOT EXISTS consent_text TEXT,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contact_channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS share_with_university BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS university_share_consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS university_share_consent_version TEXT,
  ADD COLUMN IF NOT EXISTS university_share_consent_text TEXT,
  ADD COLUMN IF NOT EXISTS qualification TEXT,
  ADD COLUMN IF NOT EXISTS goal TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT;

ALTER TABLE public.leads
  ADD CONSTRAINT leads_university_share_requires_evidence CHECK (
    NOT share_with_university OR (
      university_slug IS NOT NULL
      AND university_share_consent_at IS NOT NULL
      AND university_share_consent_version = 'university-share-2026.09'
      AND nullif(trim(coalesce(university_share_consent_text, '')), '') IS NOT NULL
    )
  ) NOT VALID;

REVOKE INSERT ON public.leads FROM anon;
DROP POLICY IF EXISTS "anyone can submit a lead" ON public.leads;

-- Keep manual lead creation available only to authenticated administrators.
DROP POLICY IF EXISTS "admins insert leads" ON public.leads;
CREATE POLICY "admins insert leads"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS leads_phone_created_at_idx
  ON public.leads (phone, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_created_at_idx
  ON public.leads (created_at DESC);

CREATE TABLE IF NOT EXISTS public.lead_intake_rate_limits (
  bucket_hash TEXT PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_intake_rate_limits_last_attempt_idx
  ON public.lead_intake_rate_limits (last_attempt_at);

ALTER TABLE public.lead_intake_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.lead_intake_rate_limits FROM PUBLIC, anon, authenticated;

-- Remove the earlier signature if this migration was tested before the explicit
-- consent flag and displayed consent text were added.
DROP FUNCTION IF EXISTS public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
);
DROP FUNCTION IF EXISTS public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
);

CREATE OR REPLACE FUNCTION public.submit_counselling_lead(
  p_full_name TEXT,
  p_phone TEXT,
  p_email TEXT DEFAULT NULL,
  p_university_slug TEXT DEFAULT NULL,
  p_program_slug TEXT DEFAULT NULL,
  p_source_path TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_contact_channels JSONB DEFAULT '[]'::jsonb,
  p_consent_given BOOLEAN DEFAULT FALSE,
  p_consent_version TEXT DEFAULT NULL,
  p_consent_text TEXT DEFAULT NULL,
  p_share_with_university BOOLEAN DEFAULT FALSE,
  p_university_share_consent_version TEXT DEFAULT NULL,
  p_university_share_consent_text TEXT DEFAULT NULL,
  p_qualification TEXT DEFAULT NULL,
  p_goal TEXT DEFAULT NULL,
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_lead_id UUID;
  cleaned_phone TEXT := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  cleaned_email TEXT := nullif(trim(coalesce(p_email, '')), '');
  selected_channel TEXT;
  request_headers JSONB := coalesce(
    nullif(current_setting('request.headers', TRUE), '')::jsonb,
    '{}'::jsonb
  );
  raw_client_key TEXT;
  client_bucket TEXT;
  client_attempts INTEGER;
  selected_university_name TEXT;
  expected_university_share_text TEXT;
BEGIN
  IF char_length(trim(coalesce(p_full_name, ''))) < 2
    OR char_length(trim(coalesce(p_full_name, ''))) > 100 THEN
    RAISE EXCEPTION 'invalid_name';
  END IF;

  IF cleaned_phone !~ '^[6-9][0-9]{9}$' THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;

  IF cleaned_email IS NOT NULL AND (
    char_length(cleaned_email) > 254
    OR cleaned_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ) THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  IF jsonb_typeof(coalesce(p_contact_channels, '[]'::jsonb)) <> 'array' THEN
    RAISE EXCEPTION 'invalid_contact_channel';
  END IF;

  IF jsonb_array_length(coalesce(p_contact_channels, '[]'::jsonb)) <> 1
    OR NOT (coalesce(p_contact_channels, '[]'::jsonb) <@ '["call", "whatsapp", "email"]'::jsonb) THEN
    RAISE EXCEPTION 'invalid_contact_channel';
  END IF;

  selected_channel := p_contact_channels ->> 0;

  IF selected_channel = 'email' AND cleaned_email IS NULL THEN
    RAISE EXCEPTION 'email_required_for_channel';
  END IF;

  IF p_consent_given IS DISTINCT FROM TRUE
    OR trim(coalesce(p_consent_version, '')) <> 'counselling-2026.09'
    OR trim(coalesce(p_consent_text, '')) <> 'Use my submitted details to provide the counselling response I requested. I can withdraw permission at any time.' THEN
    RAISE EXCEPTION 'consent_required';
  END IF;

  IF p_university_slug IS NOT NULL AND p_university_slug <> ''
    AND (char_length(p_university_slug) > 160 OR p_university_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$') THEN
    RAISE EXCEPTION 'invalid_university';
  END IF;

  IF p_program_slug IS NOT NULL AND p_program_slug <> ''
    AND (char_length(p_program_slug) > 160 OR p_program_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$') THEN
    RAISE EXCEPTION 'invalid_program';
  END IF;

  IF coalesce(p_share_with_university, FALSE) THEN
    IF nullif(trim(coalesce(p_university_slug, '')), '') IS NULL THEN
      RAISE EXCEPTION 'university_required_for_sharing';
    END IF;

    SELECT university.name
    INTO selected_university_name
    FROM public.universities university
    WHERE university.slug = trim(p_university_slug)
      AND university.published = TRUE;

    IF selected_university_name IS NULL THEN
      RAISE EXCEPTION 'invalid_university';
    END IF;

    expected_university_share_text :=
      'You may share these enquiry details only with '
      || selected_university_name
      || ' for this request. This is optional and is not selected by default.';

    IF trim(coalesce(p_university_share_consent_version, '')) <> 'university-share-2026.09'
      OR trim(coalesce(p_university_share_consent_text, '')) <> expected_university_share_text THEN
      RAISE EXCEPTION 'university_share_consent_required';
    END IF;
  END IF;

  IF p_qualification IS NOT NULL AND p_qualification NOT IN ('Student', 'Parent') THEN
    RAISE EXCEPTION 'invalid_qualification';
  END IF;

  IF char_length(coalesce(p_goal, '')) > 160
    OR char_length(coalesce(p_source_path, '')) > 500
    OR char_length(coalesce(p_message, '')) > 2000
    OR char_length(coalesce(p_utm_source, '')) > 160
    OR char_length(coalesce(p_utm_medium, '')) > 160
    OR char_length(coalesce(p_utm_campaign, '')) > 160
    OR char_length(coalesce(p_referrer, '')) > 500 THEN
    RAISE EXCEPTION 'field_too_long';
  END IF;

  -- A global burst ceiling protects the public database even if an upstream
  -- proxy does not expose a usable client address. Production should still
  -- add an edge/WAF challenge before this RPC.
  IF (SELECT count(*) FROM public.leads WHERE created_at > now() - interval '1 minute') >= 60 THEN
    RAISE EXCEPTION 'intake_temporarily_busy';
  END IF;

  raw_client_key := coalesce(
    nullif(trim(request_headers ->> 'cf-connecting-ip'), ''),
    nullif(trim(split_part(coalesce(request_headers ->> 'x-forwarded-for', ''), ',', 1)), ''),
    nullif(trim(request_headers ->> 'x-real-ip'), '')
  );

  IF raw_client_key IS NOT NULL THEN
    client_bucket := md5('dekhocampus-lead-intake:' || raw_client_key);
    INSERT INTO public.lead_intake_rate_limits (
      bucket_hash,
      window_started_at,
      attempts,
      last_attempt_at
    ) VALUES (
      client_bucket,
      now(),
      1,
      now()
    )
    ON CONFLICT (bucket_hash) DO UPDATE SET
      window_started_at = CASE
        WHEN public.lead_intake_rate_limits.window_started_at <= now() - interval '10 minutes'
          THEN now()
        ELSE public.lead_intake_rate_limits.window_started_at
      END,
      attempts = CASE
        WHEN public.lead_intake_rate_limits.window_started_at <= now() - interval '10 minutes'
          THEN 1
        ELSE public.lead_intake_rate_limits.attempts + 1
      END,
      last_attempt_at = now()
    RETURNING attempts INTO client_attempts;

    IF client_attempts > 5 THEN
      RAISE EXCEPTION 'rate_limit_exceeded';
    END IF;
  END IF;

  -- Serialise duplicate checks per phone number so simultaneous requests cannot
  -- both pass the two-minute replay guard.
  PERFORM pg_advisory_xact_lock(hashtext(cleaned_phone));

  IF EXISTS (
    SELECT 1
    FROM public.leads
    WHERE phone = cleaned_phone
      AND created_at > now() - interval '2 minutes'
  ) THEN
    RAISE EXCEPTION 'duplicate_recent_enquiry';
  END IF;

  INSERT INTO public.leads (
    full_name,
    phone,
    email,
    university_slug,
    program_slug,
    source_path,
    message,
    status,
    consent_version,
    consent_text,
    consent_at,
    contact_channels,
    share_with_university,
    university_share_consent_at,
    university_share_consent_version,
    university_share_consent_text,
    qualification,
    goal,
    utm_source,
    utm_medium,
    utm_campaign,
    referrer
  ) VALUES (
    trim(p_full_name),
    cleaned_phone,
    cleaned_email,
    nullif(trim(coalesce(p_university_slug, '')), ''),
    nullif(trim(coalesce(p_program_slug, '')), ''),
    nullif(trim(coalesce(p_source_path, '')), ''),
    nullif(trim(coalesce(p_message, '')), ''),
    'new',
    trim(p_consent_version),
    trim(p_consent_text),
    now(),
    jsonb_build_array(selected_channel),
    coalesce(p_share_with_university, FALSE),
    CASE WHEN coalesce(p_share_with_university, FALSE) THEN now() ELSE NULL END,
    CASE
      WHEN coalesce(p_share_with_university, FALSE)
        THEN trim(p_university_share_consent_version)
      ELSE NULL
    END,
    CASE
      WHEN coalesce(p_share_with_university, FALSE)
        THEN trim(p_university_share_consent_text)
      ELSE NULL
    END,
    p_qualification,
    nullif(trim(coalesce(p_goal, '')), ''),
    nullif(trim(coalesce(p_utm_source, '')), ''),
    nullif(trim(coalesce(p_utm_medium, '')), ''),
    nullif(trim(coalesce(p_utm_campaign, '')), ''),
    nullif(trim(coalesce(p_referrer, '')), '')
  )
  RETURNING id INTO new_lead_id;

  DELETE FROM public.lead_intake_rate_limits
  WHERE last_attempt_at < now() - interval '1 day';

  RETURN new_lead_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated;

COMMENT ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) IS 'Validated, consent-aware public counselling intake. Workflow fields cannot be set by the caller.';

COMMENT ON TABLE public.lead_intake_rate_limits IS
  'Pseudonymous network-derived buckets used only to throttle public counselling intake abuse; stale rows are opportunistically pruned.';
