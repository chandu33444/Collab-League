-- Migration 002: Profile Tables for Creators and Businesses
-- Creates role-specific profile tables with Row Level Security

-- =============================================
-- CREATORS TABLE
-- =============================================

CREATE TABLE public.creators (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  primary_platform TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  niche TEXT NOT NULL,
  niches TEXT[] DEFAULT '{}',
  followers_count INTEGER DEFAULT 0,
  contact_email TEXT NOT NULL,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on creators table
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creators
CREATE POLICY "Creators can read own profile"
  ON public.creators FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Creators can update own profile"
  ON public.creators FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Creators can insert own profile"
  ON public.creators FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Businesses can view active public creators"
  ON public.creators FOR SELECT
  USING (
    is_active = true 
    AND is_public = true
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'business'
    )
  );

-- =============================================
-- BUSINESSES TABLE
-- =============================================

CREATE TABLE public.businesses (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email TEXT NOT NULL,
  company_size TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on businesses table
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Businesses can read own profile"
  ON public.businesses FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Businesses can update own profile"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Businesses can insert own profile"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Creators can view businesses"
  ON public.businesses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'creator'
    )
  );

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_creators_is_public ON public.creators(is_public);
CREATE INDEX idx_creators_is_active ON public.creators(is_active);
CREATE INDEX idx_creators_niche ON public.creators(niche);
CREATE INDEX idx_creators_primary_platform ON public.creators(primary_platform);
CREATE INDEX idx_businesses_industry ON public.businesses(industry);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for creators table
CREATE TRIGGER update_creators_updated_at
  BEFORE UPDATE ON public.creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for businesses table
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
