-- Migration 004: Campaign Management Tables
-- Creates campaigns and campaign_notes tables with RLS and auto-creation trigger

-- =============================================
-- CAMPAIGNS TABLE
-- =============================================

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID UNIQUE NOT NULL REFERENCES public.collaboration_requests(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  
  -- Campaign Details (copied from request)
  campaign_name TEXT NOT NULL,
  campaign_description TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  budget_range TEXT,
  start_date DATE,
  end_date DATE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'in_progress' 
    CHECK (status IN ('in_progress', 'completed', 'cancelled')),
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_campaigns_business ON public.campaigns(business_id);
CREATE INDEX idx_campaigns_creator ON public.campaigns(creator_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_created ON public.campaigns(created_at DESC);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Businesses can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = business_id);

CREATE POLICY "Creators can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = creator_id);

CREATE POLICY "Participants can update campaign status"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() IN (business_id, creator_id));

-- =============================================
-- CAMPAIGN NOTES TABLE
-- =============================================

CREATE TABLE public.campaign_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient retrieval
CREATE INDEX idx_notes_campaign ON public.campaign_notes(campaign_id, created_at);
CREATE INDEX idx_notes_author ON public.campaign_notes(author_id);

-- Enable RLS
ALTER TABLE public.campaign_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only campaign participants can read/write)
CREATE POLICY "Participants can view campaign notes"
  ON public.campaign_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = campaign_id
      AND (business_id = auth.uid() OR creator_id = auth.uid())
    )
  );

CREATE POLICY "Participants can add notes"
  ON public.campaign_notes FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = campaign_id
      AND (business_id = auth.uid() OR creator_id = auth.uid())
    )
  );

-- =============================================
-- TRIGGER: Auto-create campaign on request acceptance
-- =============================================

CREATE OR REPLACE FUNCTION create_campaign_from_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create campaign when status changes from pending to accepted
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO public.campaigns (
      request_id, 
      business_id, 
      creator_id,
      campaign_name, 
      campaign_description, 
      deliverables,
      budget_range, 
      start_date, 
      end_date
    )
    VALUES (
      NEW.id, 
      NEW.business_id, 
      NEW.creator_id,
      NEW.campaign_name, 
      NEW.campaign_description, 
      NEW.deliverables,
      NEW.budget_range, 
      NEW.start_date, 
      NEW.end_date
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_request_accepted
  AFTER UPDATE ON public.collaboration_requests
  FOR EACH ROW
  EXECUTE FUNCTION create_campaign_from_request();

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
