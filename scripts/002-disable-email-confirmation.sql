-- Disable email confirmation in Supabase
-- This needs to be done in your Supabase dashboard under Authentication > Settings
-- Set "Enable email confirmations" to OFF

-- You can also run this if you have the right permissions:
-- UPDATE auth.config SET enable_signup = true, enable_email_confirmations = false;

-- Note: The above SQL might not work due to permissions
-- Instead, go to your Supabase dashboard:
-- 1. Go to Authentication > Settings
-- 2. Scroll down to "Email Auth"
-- 3. Turn OFF "Enable email confirmations"
-- 4. Click Save
