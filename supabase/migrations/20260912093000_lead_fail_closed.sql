-- Keep lead intake private even if a later migration is stopped for an
-- administrator review. This timestamp intentionally precedes the invite-only
-- migration so a partially completed push cannot leave the browser RPC open.

REVOKE ALL ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC, anon, authenticated, service_role;

COMMENT ON FUNCTION public.submit_counselling_lead(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, BOOLEAN, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) IS 'Private validated counselling-intake implementation. The same-origin application proxy is the only supported public path.';
