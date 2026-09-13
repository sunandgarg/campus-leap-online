-- Additive release safeguards for databases that applied an earlier revision
-- of the September migrations before the final production review.

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Staff may update workflow state and private notes, never rewrite the
-- learner's original message or consent evidence.
REVOKE UPDATE ON public.leads FROM authenticated;
GRANT UPDATE (status, internal_notes) ON public.leads TO authenticated;

REVOKE ALL ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC, anon, authenticated, service_role;

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
    AND next_review_at IS NOT NULL
    AND next_review_at > now()
  );
