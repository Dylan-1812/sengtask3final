-- Create the missing confirm_user_email function
CREATE OR REPLACE FUNCTION public.confirm_user_email(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmed_at = COALESCE(confirmed_at, NOW()),
    updated_at = NOW()
  WHERE id = user_id;

  RETURN 'Email confirmed for user: ' || user_email;
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error confirming email: ' || SQLERRM;
END;
$$;

-- Create the list_recent_users function if it doesn't exist
CREATE OR REPLACE FUNCTION public.list_recent_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  email_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
EXCEPTION WHEN OTHERS THEN
  -- Return empty result if there's an error
  RETURN;
END;
$$;

-- Create the confirm_all_unconfirmed_users function
CREATE OR REPLACE FUNCTION public.confirm_all_unconfirmed_users()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE auth.users 
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmed_at = COALESCE(confirmed_at, NOW()),
    updated_at = NOW()
  WHERE email_confirmed_at IS NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
EXCEPTION WHEN OTHERS THEN
  RETURN -1;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.confirm_user_email(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.list_recent_users() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_all_unconfirmed_users() TO anon, authenticated;

-- Ensure the create_user_profile function exists
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  username TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Insert the profile with elevated privileges
  INSERT INTO public.profiles (id, first_name, last_name, username)
  VALUES (user_id, first_name, last_name, username)
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    username = EXCLUDED.username,
    updated_at = NOW();

  -- Return the created profile
  SELECT row_to_json(p.*) INTO result
  FROM public.profiles p
  WHERE p.id = user_id;

  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_user_profile(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;
