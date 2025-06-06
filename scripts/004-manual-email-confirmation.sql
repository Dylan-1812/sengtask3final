-- Function to manually confirm user emails (for development/testing)
CREATE OR REPLACE FUNCTION confirm_user_email(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;

  IF user_id IS NULL THEN
    RETURN 'User not found';
  END IF;

  -- Update the user to confirm their email
  UPDATE auth.users
  SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
  WHERE id = user_id;

  RETURN 'Email confirmed for user: ' || user_email;
END;
$$;

-- Function to list recent users for debugging
CREATE OR REPLACE FUNCTION list_recent_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at
  FROM auth.users u
  ORDER BY u.created_at DESC
  LIMIT 10;
END;
$$;
