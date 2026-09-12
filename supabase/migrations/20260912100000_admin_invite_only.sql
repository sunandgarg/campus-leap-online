-- Remove the unsafe "first registrant becomes admin" bootstrap path.
-- Administrators must be provisioned out-of-band with the service role after
-- their identity has been verified. Public/OAuth sign-ups never gain a
-- privileged role automatically.

-- Do not silently preserve an account promoted by the retired first-user
-- bootstrap. Existing installations must inventory, revoke and explicitly
-- re-provision the verified owner before this migration is applied.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE role = 'admin'
  ) THEN
    RAISE EXCEPTION
      'admin_role_review_required: remove legacy admin grants, apply this migration, then re-provision verified admins with service-role tooling';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Creates a non-privileged profile and user role. Admin roles are invite-only and must be assigned with trusted service-role tooling.';
