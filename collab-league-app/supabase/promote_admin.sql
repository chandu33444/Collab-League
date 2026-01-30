-- Helper script to promote a user to Admin
-- RUN THIS IN SUPABASE SQL EDITOR

-- Replace 'your_email@example.com' with the actual email
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@HERE'
);

-- Verify the change
SELECT * FROM public.profiles WHERE role = 'admin';
