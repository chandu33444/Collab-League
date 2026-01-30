-- Migration 003: Collaboration Requests
-- Creates table for businesses to send collaboration requests to creators

-- =============================================
-- COLLABORATION_REQUESTS TABLE
-- =============================================

CREATE TABLE public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  
  -- Request Details
  campaign_name TEXT NOT NULL,
  campaign_description TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  budget_range TEXT,
  start_date DATE,
  end_date DATE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'accepted', 'rejected', 'expired', 'cancelled')),
  
  -- Response
  creator_notes TEXT,
  responded_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent duplicate pending requests
CREATE UNIQUE INDEX idx_unique_pending_request 
  ON public.collaboration_requests(business_id, creator_id, status) 
  WHERE status = 'pending';

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_requests_business ON public.collaboration_requests(business_id);
CREATE INDEX idx_requests_creator ON public.collaboration_requests(creator_id);
CREATE INDEX idx_requests_status ON public.collaboration_requests(status);
CREATE INDEX idx_requests_created_at ON public.collaboration_requests(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- Businesses can view own sent requests
CREATE POLICY "Businesses can view own sent requests"
  ON public.collaboration_requests FOR SELECT
  USING (auth.uid() = business_id);

-- Creators can view received requests
CREATE POLICY "Creators can view received requests"
  ON public.collaboration_requests FOR SELECT
  USING (auth.uid() = creator_id);

-- Businesses can create requests
CREATE POLICY "Businesses can create requests"
  ON public.collaboration_requests FOR INSERT
  WITH CHECK (
    auth.uid() = business_id
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'business'
    )
  );

-- Businesses can cancel own pending requests
CREATE POLICY "Businesses can cancel own pending requests"
  ON public.collaboration_requests FOR UPDATE
  USING (auth.uid() = business_id AND status = 'pending')
  WITH CHECK (status = 'cancelled');

-- Creators can respond to requests
CREATE POLICY "Creators can respond to requests"
  ON public.collaboration_requests FOR UPDATE
  USING (auth.uid() = creator_id AND status = 'pending')
  WITH CHECK (status IN ('accepted', 'rejected'));

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.collaboration_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
