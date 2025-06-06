-- Create RPC function to create profiles with elevated privileges
CREATE OR REPLACE FUNCTION create_user_profile(
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
  RAISE EXCEPTION 'Failed to create profile: %', SQLERRM;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;
