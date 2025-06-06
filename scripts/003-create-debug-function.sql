-- Create a debug function to help troubleshoot auth issues
CREATE OR REPLACE FUNCTION get_auth_users_debug()
RETURNS TABLE (
  id UUID,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
) 
SECURITY DEFINER
AS $$
BEGIN
  -- This function helps debug auth issues
  -- Note: This should only be used for debugging and removed in production
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.email_confirmed_at,
    au.created_at,
    au.last_sign_in_at
  FROM auth.users au
  ORDER BY au.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
