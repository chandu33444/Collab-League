# Phase 4: Campaign Management

> **Goal:** Transform accepted collaboration requests into managed campaigns with lifecycle tracking and internal communication.

---

## 1. Scope

### Features
- Auto-create campaign when request is accepted
- Campaign lifecycle management (In Progress → Completed)
- Internal notes/messaging per campaign
- Campaign detail views for both parties
- Campaign progress tracking

### Pages & Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/dashboard/campaigns` | List all campaigns | Both roles |
| `/dashboard/campaigns/[id]` | Campaign detail & management | Participants only |

### Components
- `CampaignList` – Grid/list of campaign cards
- `CampaignCard` – Campaign summary with status
- `CampaignDetail` – Full campaign view
- `CampaignTimeline` – Visual lifecycle progress
- `CampaignNotes` – Internal communication thread
- `NoteInput` – Add new notes
- `CampaignActions` – Status transition buttons

---

## 2. Continuity

### Builds On
- **Phase 3:** Accepted requests trigger campaign creation
- **Phase 2:** Brand & Influencer profiles for campaign participants
- **Phase 1:** Auth context for access control

### Prepares For
- **Phase 5:** Campaign data feeds dashboard analytics
- **Phase 6:** Campaign completion triggers potential review/rating system

---

## 3. Technical Implementation

### 3.1 Database Schema

**`campaigns` table**
```sql
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID UNIQUE NOT NULL REFERENCES public.collaboration_requests(id),
  brand_id UUID NOT NULL REFERENCES public.brands(id),
  influencer_id UUID NOT NULL REFERENCES public.influencers(id),
  
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

-- Indexes
CREATE INDEX idx_campaigns_brand ON public.campaigns(brand_id);
CREATE INDEX idx_campaigns_influencer ON public.campaigns(influencer_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Brands can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = brand_id);

CREATE POLICY "Influencers can view own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = influencer_id);

CREATE POLICY "Participants can update campaign status"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() IN (brand_id, influencer_id));
```

**`campaign_notes` table**
```sql
CREATE TABLE public.campaign_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient retrieval
CREATE INDEX idx_notes_campaign ON public.campaign_notes(campaign_id);

-- Enable RLS
ALTER TABLE public.campaign_notes ENABLE ROW LEVEL SECURITY;

-- Policies (only campaign participants can read/write)
CREATE POLICY "Participants can view campaign notes"
  ON public.campaign_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = campaign_id
      AND (brand_id = auth.uid() OR influencer_id = auth.uid())
    )
  );

CREATE POLICY "Participants can add notes"
  ON public.campaign_notes FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND EXISTS (
      SELECT 1 FROM public.campaigns
      WHERE id = campaign_id
      AND (brand_id = auth.uid() OR influencer_id = auth.uid())
    )
  );
```

**Trigger: Auto-create campaign on request acceptance**
```sql
CREATE OR REPLACE FUNCTION create_campaign_from_request()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO public.campaigns (
      request_id, brand_id, influencer_id,
      campaign_name, campaign_description, deliverables,
      budget_range, start_date, end_date
    )
    SELECT 
      NEW.id, NEW.brand_id, NEW.influencer_id,
      NEW.campaign_name, NEW.campaign_description, NEW.deliverables,
      NEW.budget_range, NEW.start_date, NEW.end_date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_request_accepted
  AFTER UPDATE ON public.collaboration_requests
  FOR EACH ROW
  EXECUTE FUNCTION create_campaign_from_request();
```

### 3.2 Folder Structure Additions

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── campaigns/
│   │   │   ├── page.tsx           # All campaigns
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Campaign detail
├── components/
│   ├── campaigns/
│   │   ├── CampaignList.tsx
│   │   ├── CampaignCard.tsx
│   │   ├── CampaignDetail.tsx
│   │   ├── CampaignTimeline.tsx
│   │   ├── CampaignNotes.tsx
│   │   ├── NoteInput.tsx
│   │   └── CampaignActions.tsx
```

### 3.3 Server Actions

**`app/actions/campaigns.ts`**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Get all campaigns for current user
export async function getCampaigns() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  const idField = profile?.role === 'brand' ? 'brand_id' : 'influencer_id'
  const joinTable = profile?.role === 'brand' ? 'influencers' : 'brands'
  const joinFields = profile?.role === 'brand' 
    ? 'full_name, avatar_url, niche' 
    : 'brand_name, logo_url, industry'
  
  const { data, error } = await supabase
    .from('campaigns')
    .select(`*, partner:${joinTable}(${joinFields})`)
    .eq(idField, user.id)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Get single campaign
export async function getCampaign(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      brand:brands(brand_name, logo_url, industry, contact_email),
      influencer:influencers(full_name, avatar_url, niche, primary_platform, contact_email)
    `)
    .eq('id', id)
    .single()
  
  if (error) return null
  
  // Verify user is participant
  if (data.brand_id !== user.id && data.influencer_id !== user.id) {
    return null
  }
  
  return data
}

// Get campaign notes
export async function getCampaignNotes(campaignId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('campaign_notes')
    .select(`
      *,
      author:profiles(
        role,
        brand:brands(brand_name),
        influencer:influencers(full_name)
      )
    `)
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

// Add campaign note
export async function addCampaignNote(campaignId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('campaign_notes')
    .insert({
      campaign_id: campaignId,
      author_id: user.id,
      content
    })
  
  if (error) return { error: error.message }
  
  revalidatePath(`/dashboard/campaigns/${campaignId}`)
  return { success: true }
}

// Update campaign status
export async function updateCampaignStatus(
  campaignId: string, 
  status: 'completed' | 'cancelled'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString()
  }
  
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  }
  
  const { error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', campaignId)
  
  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/campaigns')
  revalidatePath(`/dashboard/campaigns/${campaignId}`)
  return { success: true }
}
```

### 3.4 Campaign Timeline Component

**`components/campaigns/CampaignTimeline.tsx`**
```typescript
const STEPS = [
  { key: 'requested', label: 'Requested' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' }
]

export function CampaignTimeline({ status }: { status: string }) {
  const currentIndex = STEPS.findIndex(s => s.key === status)
  
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${i <= currentIndex ? 'bg-primary text-white' : 'bg-surface-hover text-muted'}
          `}>
            {i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`
              w-12 h-0.5 mx-1
              ${i < currentIndex ? 'bg-primary' : 'bg-border'}
            `} />
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## 4. Acceptance Criteria

- [ ] Campaign auto-created when request is accepted
- [ ] Both participants can view campaign details
- [ ] Campaign timeline shows current status
- [ ] Participants can add notes visible to both
- [ ] Notes are timestamped and show author name
- [ ] Either party can mark campaign as completed
- [ ] Campaign status updates immediately
- [ ] RLS prevents unauthorized access

---

## 5. Deliverables

| Type | Items |
|------|-------|
| Pages | Campaigns list, Campaign detail |
| Components | CampaignCard, CampaignTimeline, CampaignNotes |
| Database | `campaigns`, `campaign_notes` tables with RLS, trigger |
| Server Actions | getCampaigns, getCampaign, addNote, updateStatus |
