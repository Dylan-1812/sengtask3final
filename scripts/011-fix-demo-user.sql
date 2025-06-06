-- Script to ensure the demo user exists and is properly configured

-- First, confirm any existing demo user
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'demo@tailtrails.com';

-- Create a function to ensure the demo user exists
CREATE OR REPLACE FUNCTION ensure_demo_user()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  demo_user_id UUID;
  demo_profile_exists BOOLEAN;
BEGIN
  -- Check if demo user exists
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@tailtrails.com'
  LIMIT 1;
  
  -- If demo user doesn't exist, we'll return a message
  -- The actual creation will happen through the API
  IF demo_user_id IS NULL THEN
    RETURN 'Demo user does not exist';
  END IF;
  
  -- Ensure demo user is confirmed
  UPDATE auth.users
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmed_at = COALESCE(confirmed_at, NOW()),
    updated_at = NOW()
  WHERE id = demo_user_id;
  
  -- Check if demo user has a profile
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = demo_user_id
  ) INTO demo_profile_exists;
  
  -- Create profile if it doesn't exist
  IF NOT demo_profile_exists THEN
    INSERT INTO public.profiles (id, first_name, last_name, username, created_at, updated_at)
    VALUES (
      demo_user_id,
      'Demo',
      'User',
      'demo_user',
      NOW(),
      NOW()
    );
    RETURN 'Demo user confirmed and profile created';
  END IF;
  
  RETURN 'Demo user confirmed';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION ensure_demo_user() TO anon, authenticated;

-- Run the function to ensure demo user is properly set up
SELECT ensure_demo_user();
