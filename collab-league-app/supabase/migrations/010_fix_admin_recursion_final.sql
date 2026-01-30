-- Migration 010: Fix Admin RLS Recursion (Final)
-- Ensures policies are cleaner and function is properly defined.

-- 1. Drop ALL Admin policies potentially created in previous migrations to ensure clean slate
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update active status" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all creators" ON public.creators;
DROP POLICY IF EXISTS "Admins can update creators" ON public.creators;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can update businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can view all campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can update campaigns" ON public.campaigns;

-- 2. Define is_admin with search_path safety
CREATE OR REPLACE FUNCTION public.get_is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Direct check on profiles table
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 3. Create Simplified Policies using the new function name

-- Profiles
CREATE POLICY "admin_view_profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.role() = 'authenticated' AND 
    public.get_is_admin()
  );

CREATE POLICY "admin_update_profiles"
  ON public.profiles FOR UPDATE
  USING ( public.get_is_admin() );

-- Creators
CREATE POLICY "admin_view_creators"
  ON public.creators FOR SELECT
  USING ( public.get_is_admin() );

CREATE POLICY "admin_update_creators"
  ON public.creators FOR UPDATE
  USING ( public.get_is_admin() );

-- Businesses
CREATE POLICY "admin_view_businesses"
  ON public.businesses FOR SELECT
  USING ( public.get_is_admin() );

CREATE POLICY "admin_update_businesses"
  ON public.businesses FOR UPDATE
  USING ( public.get_is_admin() );

-- Campaigns
CREATE POLICY "admin_view_campaigns"
  ON public.campaigns FOR SELECT
  USING ( public.get_is_admin() );

CREATE POLICY "admin_update_campaigns"
  ON public.campaigns FOR UPDATE
  USING ( public.get_is_admin() );
