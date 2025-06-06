-- First, let's check and update the auth configuration
-- This script attempts to disable email confirmation at the database level

-- Check current auth settings
SELECT 
  COALESCE(config->'DISABLE_SIGNUP', 'false') as disable_signup,
  COALESCE(config->'ENABLE_EMAIL_CONFIRMATIONS', 'true') as email_confirmations,
  COALESCE(config->'ENABLE_EMAIL_AUTOCONFIRM', 'false') as email_autoconfirm
FROM auth.config;

-- Try to update auth config (this might not work due to permissions)
-- UPDATE auth.config SET config = jsonb_set(config, '{ENABLE_EMAIL_CONFIRMATIONS}', 'false');
-- UPDATE auth.config SET config = jsonb_set(config, '{ENABLE_EMAIL_AUTOCONFIRM}', 'true');

-- Alternative: Create a function to auto-confirm users
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user's email
  NEW.email_confirmed_at = NOW();
  NEW.confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-confirm users on signup
DROP TRIGGER IF EXISTS auto_confirm_user_trigger ON auth.users;
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();

-- Function to manually confirm existing users
CREATE OR REPLACE FUNCTION confirm_all_unconfirmed_users()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE auth.users 
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmed_at = COALESCE(confirmed_at, NOW())
  WHERE email_confirmed_at IS NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Confirm all existing unconfirmed users
SELECT confirm_all_unconfirmed_users() as confirmed_users_count;
