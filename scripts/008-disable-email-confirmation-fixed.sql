-- Fixed version - Auto-confirm users without touching auth.config
-- Create a function to auto-confirm users on signup
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user's email immediately
  NEW.email_confirmed_at = NOW();
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
    updated_at = NOW()
  WHERE email_confirmed_at IS NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Confirm all existing unconfirmed users
SELECT confirm_all_unconfirmed_users() as confirmed_users_count;

-- Grant permissions
GRANT EXECUTE ON FUNCTION auto_confirm_user() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION confirm_all_unconfirmed_users() TO anon, authenticated;
