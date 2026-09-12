-- Public browsers submit through the same-origin application endpoint, where
-- Cloudflare Turnstile is verified before a database function can be reached.
-- The application sends a keyed, pseudonymous client bucket so the database
-- never rate-limits all visitors against the server's shared egress address.

CREATE OR REPLACE FUNCTION public.submit_counselling_lead_from_server(
  p_client_bucket TEXT,
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
  client_attempts INTEGER;
BEGIN
  IF p_client_bucket IS NULL OR p_client_bucket !~ '^v1_[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'invalid_client_bucket';
  END IF;

  INSERT INTO public.lead_intake_rate_limits (
    bucket_hash,
    window_started_at,
    attempts,
    last_attempt_at
  ) VALUES (
    md5('dekhocampus-server-intake:' || p_client_bucket),
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

  -- The legacy validated function also inspects PostgREST network headers.
  -- Those headers now identify the application server, not the visitor. Clear
  -- them transaction-locally so only the HMAC bucket above is used.
  PERFORM set_config('request.headers', '{}'::text, TRUE);

  RETURN public.submit_counselling_lead(
    p_full_name,
    p_phone,
    p_email,
    p_university_slug,
    p_program_slug,
    p_source_path,
    p_message,
    p_contact_channels,
    p_consent_given,
    p_consent_version,
    p_consent_text,
    p_share_with_university,
    p_university_share_consent_version,
    p_university_share_consent_text,
    p_qualification,
    p_goal,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_referrer
  );
END;
$$;

-- The original function remains an implementation detail callable by its
-- owner from the SECURITY DEFINER wrapper, but not through the public API.
REVOKE ALL ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC, anon, authenticated, service_role;

REVOKE ALL ON FUNCTION public.submit_counselling_lead_from_server(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.submit_counselling_lead_from_server(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO service_role;

COMMENT ON FUNCTION public.submit_counselling_lead_from_server(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) IS 'Trusted counselling intake wrapper. Requires a server-generated HMAC client bucket and delegates validation and insertion to the private implementation function.';

COMMENT ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) IS 'Private validated counselling-intake implementation. Public and service API execution is revoked; use the trusted server wrapper.';
