-- Migration 005: Discovery & Dashboards
-- Adds full-text search and filtering capabilities to creators table

-- =============================================
-- FULL TEXT SEARCH
-- =============================================

-- Add search_vector column to creators table
-- Combined index of full_name, bio, and niche
ALTER TABLE public.creators 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english', 
    coalesce(full_name, '') || ' ' || 
    coalesce(bio, '') || ' ' || 
    coalesce(niche, '')
  )
) STORED;

-- Create GIN index for fast text search
CREATE INDEX idx_creators_search ON public.creators USING gin(search_vector);

-- =============================================
-- FILTERING INDEXES
-- =============================================

-- Index for filtering by niche
CREATE INDEX IF NOT EXISTS idx_creators_niche ON public.creators(niche);

-- Index for filtering by platform
CREATE INDEX IF NOT EXISTS idx_creators_platform ON public.creators(primary_platform);

-- Index for range filtering on followers
CREATE INDEX IF NOT EXISTS idx_creators_followers ON public.creators(followers_count);

-- Index for public visibility (often used in where clause)
CREATE INDEX IF NOT EXISTS idx_creators_public_active ON public.creators(is_public, is_active);
