-- DEBUG SCRIPT: Check Admin Status & RLS

-- 1. Check if you are actually an admin
-- Replace with your email
SELECT * FROM public.profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@HERE');

-- 2. Test the is_admin function manually (requires your UUID)
-- Replace UUID with the 'id' from the result above
SELECT public.get_is_admin(); 
-- Note: calling this directly might fail if not in a session with 'auth.uid()' set.
-- But we can simulate it? No, difficult in SQL editor without session.

-- 3. Check Policies on Profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- 4. FORCE ACCESS (Temporary Debugging)
-- If this makes data appear, then the issue is definitely the Policy/Function.
CREATE POLICY "debug_view_all" ON public.profiles FOR SELECT USING (true);
-- After running this, refresh the dashboard.
-- If you see users, then 'debug_view_all' worked and 'admin_view_profiles' failed.
