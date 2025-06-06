-- Create a comprehensive function to handle demo user creation and confirmation (fixed version)
CREATE OR REPLACE FUNCTION create_demo_user()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  demo_user_id UUID;
  demo_user_exists BOOLEAN;
  result JSON;
BEGIN
  -- Check if demo user already exists
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@tailtrails.com'
  LIMIT 1;
  
  demo_user_exists := demo_user_id IS NOT NULL;
  
  -- If user exists, ensure they are confirmed
  IF demo_user_exists THEN
    -- Update existing demo user to be confirmed (without touching confirmed_at)
    UPDATE auth.users
    SET 
      email_confirmed_at = NOW(),
      updated_at = NOW(),
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
        '{"first_name": "Demo", "last_name": "User", "username": "demo_user"}'::jsonb
    WHERE id = demo_user_id;
    
    -- Ensure profile exists
    INSERT INTO public.profiles (id, first_name, last_name, username, created_at, updated_at)
    VALUES (demo_user_id, 'Demo', 'User', 'demo_user', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      first_name = 'Demo',
      last_name = 'User',
      username = 'demo_user',
      updated_at = NOW();
    
    result := json_build_object(
      'success', true,
      'message', 'Demo user updated and confirmed',
      'user_id', demo_user_id,
      'action', 'updated'
    );
  ELSE
    -- User doesn't exist, we'll return a message to create via API
    result := json_build_object(
      'success', false,
      'message', 'Demo user needs to be created via API',
      'action', 'create_needed'
    );
  END IF;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', 'Error: ' || SQLERRM,
    'action', 'error'
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_demo_user() TO anon, authenticated;

-- Function to manually confirm any user by email (fixed version)
CREATE OR REPLACE FUNCTION force_confirm_user(user_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
  result JSON;
BEGIN
  -- Find the user by email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  IF user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User not found: ' || user_email
    );
  END IF;

  -- Force confirm the user (without touching confirmed_at)
  UPDATE auth.users
  SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
  WHERE id = user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'User confirmed: ' || user_email,
    'user_id', user_id
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'message', 'Error confirming user: ' || SQLERRM
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION force_confirm_user(TEXT) TO anon, authenticated;

-- Create the other required functions if they don't exist
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

-- Create list_recent_users function
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.list_recent_users() TO anon, authenticated;
