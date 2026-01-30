-- Migration 009: Fix Admin RLS Recursion
-- The previous admin policies caused infinite recursion because querying profiles triggered the policy which queried profiles again.

-- 1. Create a SECURITY DEFINER function to check admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update active status" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all creators" ON public.creators;
DROP POLICY IF EXISTS "Admins can update creators" ON public.creators;
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can update businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins can view all campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admins can update campaigns" ON public.campaigns;

-- 3. Re-create policies using the safe is_admin() function

-- Profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.role() = 'authenticated' AND 
    public.is_admin()
  );

CREATE POLICY "Admins can update active status"
  ON public.profiles FOR UPDATE
  USING ( public.is_admin() );

-- Creators
CREATE POLICY "Admins can view all creators"
  ON public.creators FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Admins can update creators"
  ON public.creators FOR UPDATE
  USING ( public.is_admin() );

-- Businesses
CREATE POLICY "Admins can view all businesses"
  ON public.businesses FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Admins can update businesses"
  ON public.businesses FOR UPDATE
  USING ( public.is_admin() );

-- Campaigns
CREATE POLICY "Admins can view all campaigns"
  ON public.campaigns FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Admins can update campaigns"
  ON public.campaigns FOR UPDATE
  USING ( public.is_admin() );
